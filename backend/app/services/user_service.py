from app.core.security import hash_password
from app.repositories.user_repository import create_user, get_user_by_email

def register_user(db, email: str, password: str):
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise ValueError("User already exists")

    hashed = hash_password(password)
    return create_user(db, email, hashed)