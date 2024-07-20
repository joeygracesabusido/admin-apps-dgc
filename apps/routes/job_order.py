from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from pydantic import BaseModel
from bson import ObjectId


from datetime import datetime, timedelta, date
from  ..authentication.authenticate_user import get_current_user


from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


from ..authentication.utils import OAuth2PasswordBearerWithCookie

from jose import jwt

JWT_SECRET = 'myjwtsecret'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

api_job_order = APIRouter()
templates = Jinja2Templates(directory="apps/templates")



from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="token")

# oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")



from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class JobOrder(BaseModel):
    jo_offices: str
    jo_department: str
    jo_ticket_no: Optional[str] = None
    jo_requested_by: str
    jo_particular: Optional[str] = None
    jo_status: Optional[str] = None
    jo_turn_overtime: Optional[datetime] = None
    jo_remarks: Optional[str] = None
    jo_user: Optional[str] = None
    date_updated: Optional[datetime] = None
    date_created: Optional[datetime] = None




@api_job_order.post('/api-insert-job-order')
async def insert_job_order(items:JobOrder, username: str = Depends(get_current_user)):
    dataInsert = dict()
     # Get the current year
    current_year = datetime.now().year

    # Check for the latest job order for the current year
    latest_job_order = mydb.job_order.find_one(
        {"jo_ticket_no": {"$regex": f"QR-{current_year}-"}},
        sort=[("jo_ticket_no", 1)]
    )

    if latest_job_order:
        # Extract the last number from the ticket number and increment it
        last_ticket_no = latest_job_order['jo_ticket_no']
        last_number = int(last_ticket_no.split('-')[-1])
        new_ticket_no = f"QR-{current_year}-{last_number + 1}"
    else:
        # If no job order exists for the current year, start with QR-year-1
        new_ticket_no = f"QR-{current_year}-1"
    dataInsert = {
        "jo_offices": items.jo_offices,
        "jo_department": items.jo_department,
        'jo_requested_by': items.jo_requested_by,
        "jo_ticket_no": new_ticket_no,
        "jo_particular":items.jo_particular,
        "jo_status": items.jo_status,
        "jo_turn_overtime": items.jo_turn_overtime,
        "jo_remarks": items.jo_remarks,
        "user": username,
        "date_created": datetime.now().isoformat(),
        "date_updated": items.date_updated.isoformat() if items.date_updated else None
        }
    mydb.job_order.insert_one(dataInsert)
    return {"message":"Data has been save"} 


@api_job_order.get('/api-get-job-order-list')
async def find_all_job_order(username: str = Depends(get_current_user)):
    """This function is querying all inventory data"""

    result = mydb.job_order.find().sort("jo_date", -1)
    
    job_order_data = [
        {
        "id": str(items['_id']),   
        "jo_offices": items['jo_offices'],
        "jo_department": items['jo_department'],
        "jo_requested_by": items['jo_requested_by'],
        "jo_ticket_no": items['jo_ticket_no'],
        "jo_particular":items['jo_particular'],
        "jo_status": items['jo_status'],
        "jo_turn_overtime": items['jo_turn_overtime'],
        "jo_remarks": items['jo_remarks'],
        "user": items['user'],
        "date_created": items['date_created'],
        "date_updated": items['date_updated']

        }
        for items in result
    ]

    return job_order_data


@api_job_order.put("/api-update-job-order/{id}")
async def api_update_(id: str,
                               items: JobOrder,
                               username: str = Depends(get_current_user)):
    
    try:
        if username == 'joeysabusido' or username == 'Dy':

            obj_id = ObjectId(id)

            update_data = {
               
                "jo_status": items.jo_status,
                "jo_turn_overtime": datetime.now(),
                "jo_remarks": items.jo_remarks,
                "user": username,
                "date_updated": datetime.now()
            }

            result = mydb.job_order.update_one({'_id': obj_id}, {'$set': update_data})

            return ('Data has been Update')
    
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))






  




