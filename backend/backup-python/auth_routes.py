from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
import re
import datetime
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def validate_phone_number(phone):
    """Telefon numarası formatını kontrol et"""
    phone_regex = re.compile(r'^0?5\d{9}$')
    return phone_regex.match(phone) is not None

def validate_password(password):
    """Şifre güvenlik kontrolü"""
    return (len(password) >= 8 and 
            any(char.isdigit() for char in password) and 
            any(char.isupper() for char in password) and 
            any(char.islower() for char in password))

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Zorunlu alanları kontrol et
    required_fields = ['firstName', 'lastName', 'phoneNumber', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} alanı zorunludur'}), 400
    
    # E-posta formatını kontrol et
    email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    if not email_pattern.match(data['email']):
        return jsonify({'error': 'Geçersiz e-posta formatı'}), 400

    # Telefon numarası formatını kontrol et
    phone_pattern = re.compile(r'^0?5[0-9]{9}$')
    if not phone_pattern.match(data['phoneNumber']):
        return jsonify({'error': 'Geçersiz telefon numarası formatı'}), 400

    # Şifre güvenliğini kontrol et
    if not validate_password(data['password']):
        return jsonify({
            "error": "Şifre en az 8 karakter uzunluğunda olmalı, " 
                     "büyük harf, küçük harf ve rakam içermelidir"
        }), 400

    # E-posta ve telefon numarası benzersizliğini kontrol et
    if db.users.find_one({'email': data['email']}):
        return jsonify({'error': 'Bu e-posta adresi zaten kayıtlı'}), 400
    
    if db.users.find_one({'phoneNumber': data['phoneNumber']}):
        return jsonify({'error': 'Bu telefon numarası zaten kayıtlı'}), 400

    # Şifreyi hashle
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Kullanıcıyı oluştur
    new_user = {
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'phoneNumber': data['phoneNumber'],
        'email': data['email'],
        'password': hashed_password
    }
    
    # Veritabanına kaydet
    db.users.insert_one(new_user)
    
    # JWT token oluştur
    access_token = create_access_token(identity=str(new_user['_id']))
    
    return jsonify({
        "message": "Kullanıcı başarıyla kaydedildi",
        "user": {
            "id": new_user['_id'],
            "firstName": new_user['firstName'],
            "lastName": new_user['lastName'],
            "email": new_user['email'],
            "phoneNumber": new_user['phoneNumber']
        },
        "access_token": access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Telefon numarası ve şifre kontrolü
    if 'phoneNumber' not in data or 'password' not in data:
        return jsonify({'error': 'Telefon numarası ve şifre zorunludur'}), 400
    
    # Kullanıcıyı bul
    user = db.users.find_one({'phoneNumber': data['phoneNumber']})
    if not user:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404
    
    # Şifreyi kontrol et
    if not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Hatalı şifre'}), 401
    
    # JWT token oluştur
    access_token = create_access_token(identity=str(user['_id']))
    
    return jsonify({
        'token': access_token,
        'user': {
            'firstName': user['firstName'],
            'lastName': user['lastName'],
            'phoneNumber': user['phoneNumber'],
            'email': user['email']
        }
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = db.users.find_one({'_id': current_user_id})
    
    if not user:
        return jsonify({"error": "Kullanıcı bulunamadı"}), 404
    
    return jsonify({
        "id": user['_id'],
        "firstName": user['firstName'],
        "lastName": user['lastName'],
        "email": user['email'],
        "phoneNumber": user['phoneNumber']
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    # E-posta kontrolü
    if 'email' not in data:
        return jsonify({'error': 'E-posta adresi zorunludur'}), 400
    
    # Kullanıcıyı bul
    user = db.users.find_one({'email': data['email']})
    if not user:
        return jsonify({'error': 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı'}), 404
    
    # 6 haneli rastgele kod oluştur
    reset_code = str(random.randint(100000, 999999))
    
    # Kodu veritabanına kaydet
    db.users.update_one(
        {'_id': user['_id']},
        {'$set': {'reset_code': reset_code, 'reset_code_expires': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)}}
    )
    
    # E-posta gönder
    try:
        sender_email = os.getenv('EMAIL_USER')
        sender_password = os.getenv('EMAIL_PASSWORD')
        
        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = data['email']
        message['Subject'] = 'AppHatim - Şifre Sıfırlama Kodu'
        
        body = f"""
        Merhaba {user['firstName']},
        
        Şifre sıfırlama talebiniz için doğrulama kodunuz: {reset_code}
        
        Bu kod 15 dakika süreyle geçerlidir.
        
        Eğer bu talebi siz yapmadıysanız, bu e-postayı dikkate almayınız.
        
        Saygılarımızla,
        AppHatim Ekibi
        """
        
        message.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)
        server.quit()
        
        return jsonify({'message': 'Şifre sıfırlama kodu e-posta adresinize gönderildi'}), 200
    
    except Exception as e:
        print(f"E-posta gönderme hatası: {str(e)}")
        return jsonify({'error': 'E-posta gönderilirken bir hata oluştu'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    # Gerekli alanları kontrol et
    required_fields = ['email', 'code', 'new_password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} alanı zorunludur'}), 400
    
    # Kullanıcıyı bul
    user = db.users.find_one({'email': data['email']})
    if not user:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404
    
    # Kodu ve süresini kontrol et
    if 'reset_code' not in user or 'reset_code_expires' not in user:
        return jsonify({'error': 'Geçersiz veya süresi dolmuş kod'}), 400
        
    if user['reset_code'] != data['code']:
        return jsonify({'error': 'Hatalı kod'}), 400
        
    if datetime.datetime.utcnow() > user['reset_code_expires']:
        return jsonify({'error': 'Kodun süresi dolmuş'}), 400
    
    # Yeni şifre güvenliğini kontrol et
    if not validate_password(data['new_password']):
        return jsonify({
            'error': 'Şifre en az 8 karakter uzunluğunda olmalı, büyük harf, küçük harf ve rakam içermelidir'
        }), 400
    
    # Şifreyi hashle ve güncelle
    hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
    
    db.users.update_one(
        {'_id': user['_id']},
        {
            '$set': {'password': hashed_password},
            '$unset': {'reset_code': '', 'reset_code_expires': ''}
        }
    )
    
    return jsonify({'message': 'Şifreniz başarıyla güncellendi'}), 200
