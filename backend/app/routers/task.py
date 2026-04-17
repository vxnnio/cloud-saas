from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.core.auth import get_current_user
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from fastapi import HTTPException
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate, TaskStatusUpdate
from fastapi import HTTPException

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse)
def create_task(payload: TaskCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = Task(title=payload.title, status="todo", owner_id=user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/", response_model=list[TaskResponse])
def list_my_tasks(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Task).filter(Task.owner_id == user.id).all()

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.title = payload.title
    db.commit()
    db.refresh(task)
    return task

@router.patch("/{task_id}/status", response_model=TaskResponse)
def update_task_status(task_id: int, payload: TaskStatusUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = payload.status
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"ok": True}