from datetime import datetime
from enum import unique
import strawberry
#from strawberry import asdict

from typing import Optional,List


from apps.grapql_models.graphqlModel import SupplierInput




from ..database.mongodb import create_mongo_client
mydb = create_mongo_client()




@strawberry.type
class insertSupplierInvt:
    @strawberry.mutation
    async def insert_supplier_ivt_supply(self, int_supplier: SupplierInput) -> str:

        try:
                
            invt_supplier_collection = mydb['inventory_supplier']
            invt_supplier_collection.create_index('name', unique=True)            
            data = {

            **int_supplier.__dict__,

                'created_at':int_supplier.created_at or datetime.utcnow(),
                'updated_at': datetime.utcnow()

            }
            
            # data = asdict(int_supplier)
            # data['created_at'] = int_supplier.created_at or datetime.utcnow(),
            # data['update_at'] = datetime.utcnow()
            #
            invt_supplier_collection.insert_one(data)
            return f"Items inserted"


        except Exception as e:

            return f"Unexpected Error: {str(e)}"


            
    

