from fastapi import FastAPI
from app.routers.health import router as health_router
from app.routers.db_ping import router as db_router
from app.routers.user import router as user_router
from app.core.db import engine
from app.models.base import Base
from app.models import user  # 讓模型註冊
from app.routers.auth import router as auth_router
from app.models import task
from app.routers.task import router as task_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(db_router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(task_router)