from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, db
from sqlalchemy import or_

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        # Kullanıcı kimliğini ve rolünü al
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        # Sadece admin ve super admin alabilir
        if current_user.role not in ['admin', 'superadmin']:
            return jsonify({"error": "Yetkisiz erişim"}), 403

        # Filtreleme parametreleri
        search = request.args.get('search', '')
        role = request.args.get('role', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))

        # Kullanıcı sorgusu
        query = User.query
        if search:
            query = query.filter(
                or_(
                    User.full_name.ilike(f'%{search}%'), 
                    User.email.ilike(f'%{search}%')
                )
            )
        
        if role:
            query = query.filter(User.role == role)

        # Sayfalama
        paginated_users = query.paginate(page=page, per_page=per_page)
        
        users = [user.to_dict() for user in paginated_users.items]
        
        return jsonify({
            'users': users,
            'total': paginated_users.total,
            'page': page,
            'per_page': per_page
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def assign_user_role(user_id):
    try:
        # Kullanıcı kimliğini ve rolünü al
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        # Sadece super admin rol atayabilir
        if current_user.role != 'superadmin':
            return jsonify({"error": "Rol atama yetkiniz yok"}), 403

        # Hedef kullanıcıyı bul
        target_user = User.query.get(user_id)
        if not target_user:
            return jsonify({"error": "Kullanıcı bulunamadı"}), 404

        # Yeni rolü al
        new_role = request.json.get('role')
        if not new_role:
            return jsonify({"error": "Rol belirtilmedi"}), 400

        # Samet Güder için özel kontrol
        if target_user.email == 'gudersamet@gmail.com':
            return jsonify({"error": "Bu kullanıcının rolü değiştirilemez"}), 403

        # Rol ataması
        target_user.role = new_role
        db.session.commit()

        return jsonify({
            "message": f"{target_user.full_name} kullanıcısının rolü {new_role} olarak güncellendi",
            "user": target_user.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
