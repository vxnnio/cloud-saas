from pydantic import BaseModel, Field
from typing import Optional


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)

class TaskUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
class TaskResponse(BaseModel):
    id: int
    title: str
    status: str

    class Config:
        from_attributes = True
class TaskStatusUpdate(BaseModel):
    status: str = Field(pattern="^(todo|doing|done)$")

