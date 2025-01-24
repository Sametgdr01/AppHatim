from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from routes import users_bp
from auth_routes import auth_bp
import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# MongoDB bağlantısı
MONGO_URI = os.getenv('MONGODB_URI', "mongodb+srv://AppHatim:App@Hatim1071@cluster0.1r6pu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(MONGO_URI)
db = client.hatim_app  # Veritabanı adı

def create_app():
    app = Flask(__name__)
    
    # Temel ayarlar
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', os.urandom(24))
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', os.urandom(24))

    # Eklentileri başlat
    jwt = JWTManager(app)
    Bcrypt(app)
    CORS(app)

    # Blueprint'leri kaydet
    app.register_blueprint(users_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
