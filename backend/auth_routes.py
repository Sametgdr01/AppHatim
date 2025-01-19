from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from app import db
import re

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
