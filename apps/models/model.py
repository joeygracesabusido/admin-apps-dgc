
from sqlmodel import Field, Session, SQLModel, create_engine,select,func,funcfilter,within_group,Relationship,Index
from typing import Optional


import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.join(current_dir, '..')
sys.path.append(parent_dir)


from database.databases import connectionDB

from datetime import date, datetime

engine = connectionDB.conn()


class User(SQLModel, table=True):
    """This is to create user Table"""
    __tablename__ = 'user'
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str = Field(nullable=False)
    email_add: str = Field(nullable=False)
    full_name: str = Field(max_length=70, default=None)
    role: str = Field(max_length=70, default=None)
    is_active: bool = Field(default=False)
    date_updated: Optional[datetime] = Field(default=None)
    date_credited: datetime = Field(default_factory=datetime.utcnow)

    __table_args__ = (Index("idx_user_unique", "username", unique=True),)


class Department(SQLModel, table=True):
    """This is for department table"""
    __tablename__ = 'department'
    id: Optional[int] = Field(default=None, primary_key=True)
    department: str =Field(index=True, unique=True)

    __table_args__ = (Index("idx_department_unique", "department", unique=True),)


def create_db_and_tables():
    
    SQLModel.metadata.create_all(engine)

# create_db_and_tables()