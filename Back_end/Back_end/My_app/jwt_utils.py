from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Login
from rest_framework_simplejwt.tokens import AccessToken,RefreshToken
from datetime import timedelta
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "5467365"

def generate_custom_access_token(user):
    payload = {
        "user_id": user.id,
        "email": user.Email,
        "role": user.role,
        "name": user.Name,
        "exp": datetime.utcnow() + timedelta(hours=2),
        "iat": datetime.utcnow(),
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def decode_token(raw_token):
    print("entery okken")
    try:
        token = AccessToken(raw_token)
        return token.payload
    except Exception as e:
        return {"error": str(e)}


class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split()
        except ValueError:
            raise AuthenticationFailed("Invalid token format")

        if prefix.lower() != "bearer":
            raise AuthenticationFailed("Invalid token prefix")

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        try:
            user = Login.objects.get(id=payload['user_id'])
        except Login.DoesNotExist:
            raise AuthenticationFailed("User not found")

        return (user, None)