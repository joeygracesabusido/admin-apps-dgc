from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import PlainTextResponse

# from .routes.login import api
# from .routes.admin import api
# from .routes.login import login_router
from apps.routes.admin import api
from apps.routes.login import login_router
from apps.routes.inventory import api_invt
from apps.routes.job_order_temp import api_jo_temp
from apps.routes.job_order import api_job_order

from apps.routes.graphql import graphql_app

from apps.routes.inventory_temp import api_inventory

from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="apps/static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(api, tags=["admin"])
app.include_router(login_router)
app.include_router(api_inventory)
app.include_router(api_jo_temp)
app.include_router(api_invt, tags=['inventory'])
app.include_router(api_job_order, tags=['Job Order'])

# Mount Strawberry's GraphQL app onto FastAPI
app.mount("/graphql", graphql_app)


