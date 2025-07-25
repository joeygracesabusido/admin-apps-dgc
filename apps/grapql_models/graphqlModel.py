from datetime import datetime
from enum import unique
import strawberry
#from strawberry import asdict

from typing import Optional,List



#this is for query
@strawberry.type
class SupplierType:
    id: Optional[str]
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    user: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


#this is for mutation
@strawberry.input
class SupplierInput:
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    user: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None



