from fastapi import APIRouter
from sqlalchemy import text
from app.core.db import engine

router = APIRouter(prefix="/db", tags=["db"])

@router.get("/ping")
def db_ping():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"db": "ok"}