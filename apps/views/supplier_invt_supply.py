from datetime import datetime
from enum import unique
import strawberry
from strawberry.types import Info
#from strawberry import asdict

from typing import Optional,List


from apps.grapql_models.graphqlModel import SupplierInput, SupplierUpdateInput


from bson import ObjectId



from ..database.mongodb import create_mongo_client
mydb = create_mongo_client()

from  ..authentication.authenticate_user import get_current_user



@strawberry.type
class insertSupplierInvt:
    @strawberry.mutation
    async def insert_supplier_ivt_supply(self,info:Info, int_supplier: SupplierInput) -> str:
        request: Request = info.context['request']
        username = get_current_user(request)

        #print(username)

        if username:
            try:

                invt_supplier_collection = mydb['inventory_supplier']
                invt_supplier_collection.create_index('name', unique=True)            
                data = {

                **int_supplier.__dict__,

                    'created_at':int_supplier.created_at or datetime.utcnow(),
                    'updated_at': datetime.utcnow(),
                    'user': username

                }

                # data = asdict(int_supplier)
                # data['created_at'] = int_supplier.created_at or datetime.utcnow(),
                # data['update_at'] = datetime.utcnow()
                #
                invt_supplier_collection.insert_one(data)
                return f"Items inserted"


            except Exception as e:

                return f"Unexpected Error: {str(e)}"


            



    @strawberry.mutation
    async def update_supplier_ivt_supply(self, info: Info, updated_data: SupplierUpdateInput) -> str:
        request: Request = info.context["request"]
        username = get_current_user(request)

        if username:
            try:
                invt_supplier_collection = mydb['inventory_supplier']
                update_fields = {
                    k: v for k, v in updated_data.__dict__.items()
                    if k != 'id' and v is not None
                }

                update_fields['updated_at'] = datetime.utcnow()
                update_fields['user'] = username

                result = invt_supplier_collection.update_one(
                    {"_id": ObjectId(updated_data.id)},
                    {"$set": update_fields}
                )

                if result.modified_count == 1:
                    return "Supplier updated successfully"
                else:
                    return "No changes made or supplier not found"

            except Exception as e:
                return f"Update Error: {str(e)}"

