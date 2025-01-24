from app import create_app
from models import db, User
import os

def create_test_users():
    app = create_app()
    
    with app.app_context():
        # Veritabanını temizle ve yeniden oluştur
        db.drop_all()
        db.create_all()

        # Super Admin Kullanıcısı
        super_admin = User(
            full_name='Samet Güder',
            email='gudersamet@gmail.com',
            phone_number='05555555555',
            role='superadmin'
        )
        super_admin.set_password('SuperAdmin123!')

        # Normal Admin Kullanıcısı
        admin = User(
            full_name='Admin Kullanıcısı',
            email='admin@hatimapp.com',
            phone_number='05444444444',
            role='admin'
        )
        admin.set_password('Admin123!')

        # Normal Kullanıcı
        normal_user = User(
            full_name='Normal Kullanıcı',
            email='user@hatimapp.com',
            phone_number='05333333333',
            role='user'
        )
        normal_user.set_password('User123!')

        # Kullanıcıları veritabanına ekle
        db.session.add(super_admin)
        db.session.add(admin)
        db.session.add(normal_user)
        
        db.session.commit()
        print("Test kullanıcıları başarıyla oluşturuldu!")

if __name__ == '__main__':
    create_test_users()
