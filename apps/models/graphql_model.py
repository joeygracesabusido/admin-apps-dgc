from datetime import datetime
from enum import unique
import strawberry
#from strawberry import asdict

from typing import Optional,List




@strawberry.input
class supplierInput:
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    user: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


