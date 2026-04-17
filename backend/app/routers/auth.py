from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.core.jwt import create_access_token, SECRET_KEY, ALGORITHM
from app.core.security import verify_password
from app.repositories.user_repository import get_user_by_email

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print("DEBUG username =", repr(form.username))
    print("DEBUG password =", repr(form.password))

    user = get_user_by_email(db, form.username)
    print("DEBUG user found =", user is not None)

    if user:
        print("DEBUG db email =", repr(user.email))
        print("DEBUG hashed_password =", user.hashed_password)
        ok = verify_password(form.password, user.hashed_password)
        print("DEBUG verify =", ok)
    else:
        ok = False

    if not user or not ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token(subject=user.email)
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/me")
def me(user=Depends(get_current_user)):
    return {"id": user.id, "email": user.email}