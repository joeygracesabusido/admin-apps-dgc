from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional
from pydantic import BaseModel
from bson import ObjectId

from decimal import Decimal


from pymongo import  DESCENDING


from datetime import datetime, timedelta, date
from  ..authentication.authenticate_user import get_current_user


from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


from ..authentication.utils import OAuth2PasswordBearerWithCookie

from jose import jwt

JWT_SECRET = 'myjwtsecret'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

api_payroll = APIRouter()
# templates = Jinja2Templates(directory="apps/templates")



# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# oauth_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="token")

# oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")



# from passlib.context import CryptContext

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Employee(BaseModel):
    company: str
    department: str
    employee_no: str
    first_name: str
    last_name: str
    designation: str
    salary_status: str
    rate: float
    employee_status: str
    user: Optional[str] = None
    date_updated: Optional[datetime] = None
    date_created: Optional[datetime] = None


# class JobOrderUpdate(BaseModel):
   
    
#     jo_particular: Optional[str] = None
#     jo_status: Optional[str] = None
#     jo_remarks: Optional[str] = None
#     jo_user: Optional[str] = None
#     date_updated: Optional[datetime] = None
#     date_created: Optional[datetime] = None




@api_payroll.post('/api-insert-employee/')
async def insert_employee(data:Employee, username: str = Depends(get_current_user)):

    try:
        if username == 'joeysabusido' or username == 'Dy':
            dataInsert = dict()
            # Get the current year
            employee_collection = mydb['employee_list']
            employee_collection.create_index("employee_no", unique=True)
        


            dataInsert = {
                "company": data.company,
                "department": data.department,
                "employee_no": data.employee_no,
                "first_name": data.first_name,
                "last_name": data.last_name,
                "designation": data.designation,
                "salary_status": data.salary_status,
                "rate": data.rate,
                "salary_status": data.salary_status,
                "employee_status": data.employee_status,
                "user": username,
                "date_created": datetime.now().isoformat(),
                "date_updated": data.date_updated.isoformat() if data.date_updated else None
            
            }
            mydb.employee_list.insert_one(dataInsert)
            return {"message": "User has been saved"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_payroll.get('/api-get-employee-list')
async def find_all_job_order(username: str = Depends(get_current_user)):
    """This function is querying all inventory data"""

    try:
        if username == 'joeysabusido' or username == 'Dy':

            result = mydb.employee_list.find().sort("last_name", -1)

            # pipeline = [
            #     {
            #         "$addFields": {
            #             "date_created": {
            #                 "$dateFromString": {
            #                     "dateString": "$date_created"
            #                 }
            #             }
            #         }
            #     },
            #     {
            #         "$sort": {
            #             "date_created": DESCENDING
            #         }
            #     }
            # ]

            # # Fetch sorted job orders
            # result = mydb.job_order.aggregate(pipeline)

            
            job_order_data = [
                {
                "id": str(items['_id']),   
                "company": items['company'],
                "department": items['department'],
                "employee_no": items['employee_no'],
                "first_name": items['first_name'],
                "last_name": items['last_name'],
                "designation": items['designation'],
                "salary_status": items['salary_status'],
                "rate": items['rate'],
                "salary_status": items['salary_status'],
                "employee_status": items['employee_status'],
                "user": items['user'],
                "date_created": items['date_created'],
                "date_updated": items['date_updated'],

                }
                for items in result
            ]

            return job_order_data
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@api_payroll.put("/api-update-employee/{id}")
async def api_update_employee(id: str,
                               data: Employee,
                               username: str = Depends(get_current_user)):
    
    try:
        if username == 'joeysabusido' or username == 'Dy':

            obj_id = ObjectId(id)

            update_data = {

                "company": data.company,
                "department": data.department,
                "employee_no": data.employee_no,
                "first_name": data.first_name,
                "last_name": data.last_name,
                "designation": data.designation,
                "salary_status": data.salary_status,
                "rate": data.rate,
                "salary_status": data.salary_status,
                "employee_status": data.employee_status,
                "user": username,
                "date_updated": datetime.now().isoformat() if data.date_updated else None
               
                
            }

            result = mydb.employee_list.update_one({'_id': obj_id}, {'$set': update_data})

            return ('Data has been Update')
    
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
            # headers={"WWW-Authenticate": "Basic"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@api_payroll.get("/api-autocomplete-employee/")
def autocomplete_employee_list(term: Optional[str] = None, username: str = Depends(get_current_user)):
    try:
        # Retrieve all employee data from the collection
        employee_data = mydb.employee_list.find()
        
        # Filter employees based on the search term
        if term:
            filtered_employee = [
                item for item in employee_data
                if term.lower() in item.get('last_name', '').lower() or term.lower() in item.get('first_name', '').lower()
            ]
        else:
            filtered_employee = []

        # Construct suggestions from filtered employees
        suggestions = [
            {
                "value": f"{item['last_name']}, {item['first_name']}",
                "id": str(item['_id']),
                "employee_no": item.get('employee_no'),
                "rate": item.get('rate'),
                "company": item.get('company'),
                "salary_status": item.get('salary_status')
            }
            for item in filtered_employee
        ]

        return suggestions

    except Exception as e:
        error_message = str(e)
        return {"error": error_message}







  




