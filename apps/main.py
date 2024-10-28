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
from apps.routes.payroll_template import api_payroll_temp
from apps.routes.payroll import api_payroll

from apps.routes.graphql import graphql_app

from apps.routes.inventory_temp import api_inventory

from apps.routes.purchase_order_temp import api_purchase_ord_temp
from apps.routes.purchase_order import api_purchase_order

from apps.routes.repair import api_repair

from apps.routes.printing_check import api_check_printing

from apps.routes.roles import api_roles

from apps.routes.accountability import api_accountability

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
app.include_router(api_invt, tags=['inventory'])
app.include_router(api_jo_temp)
app.include_router(api_job_order, tags=['Job Order'])
app.include_router(api_payroll_temp)
app.include_router(api_payroll, tags=['paryoll'])

app.include_router(api_purchase_ord_temp)
app.include_router(api_purchase_order, tags=['Purchase Order'])


app.include_router(api_repair, tags=['Repair'])

app.include_router(api_check_printing, tags=['Check Printing'])

app.include_router(api_roles, tags=['Roles'])

app.include_router(api_accountability, tags=['Accountability'])

# Mount Strawberry's GraphQL app onto FastAPI
app.mount("/mygraphql", graphql_app)


