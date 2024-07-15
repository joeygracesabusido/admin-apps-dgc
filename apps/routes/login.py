from fastapi import APIRouter, Body, HTTPException, Depends, Request, Response, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Union, List, Optional


from datetime import datetime, timedelta


from  ..database.mongodb import create_mongo_client
mydb = create_mongo_client()


from ..authentication.utils import OAuth2PasswordBearerWithCookie

from jose import jwt

JWT_SECRET = 'myjwtsecret'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

login_router = APIRouter(include_in_schema=False)
templates = Jinja2Templates(directory="apps/templates")



from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="token")



from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")






def get_password_hash(password):
    return pwd_context.hash(password)

password1 = ""
def authenticate_user(username, password):
    
    user = mydb.login.find({'$and':[{"username":username}]})
    

    for i in user:
       
        username = i['username']
        password1 = i['password']
        
   
        if user:
            
            password_check = pwd_context.verify(password,password1)
            
            return password_check

            
        else :
            False



def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()

    expire = datetime.utcnow() + expires_delta

    to_encode.update({"exp": expire})

    
    return to_encode


@login_router.get("/", response_class=HTMLResponse)
async def api_login(request: Request):
    return templates.TemplateResponse("login.html", {"request":request}) 



@login_router.get('/api-login/')
def login(username1: Optional[str],password1:Optional[str],response:Response):
    username = username1
    password = password1


    user = authenticate_user(username,password)

    if user == []:

        return {"error": "No Username is register"}
  
    elif not user:
        # raise HTTPException(status_code=400, detail="Incorrect username or password")
        
       
        
        raise HTTPException(
            status_code=400,
            detail= "Incorrect username or password",
            # headers={"WWW-Authenticate": "Basic"},
        )
    

    access_token = create_access_token(
                data = {"sub": username,"exp":datetime.utcnow() + timedelta(ACCESS_TOKEN_EXPIRE_MINUTES)}, 
                expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                                    )

    data = {"sub": username,"exp":datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)}
    jwt_token = jwt.encode(data,JWT_SECRET,algorithm=ALGORITHM)
    response.set_cookie(key="access_token", value=f'Bearer {jwt_token}',httponly=True)
    # return response
    
    return {"access_token": jwt_token, "token_type": "bearer"}


@login_router.get("/dashboard/", response_class=HTMLResponse)
async def api_login(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})



    