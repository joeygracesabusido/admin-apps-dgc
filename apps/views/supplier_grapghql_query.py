from datetime import datetime
from enum import unique
import strawberry

from typing import Optional,List


from apps.grapql_models.graphqlModel import SupplierType


from ..database.mongodb import create_mongo_client
mydb = create_mongo_client()

import re



@strawberry.type
class Query:
    @strawberry.field
    async def getSupplierList(self) -> List[SupplierType]:
        supply = mydb['inventory_supplier']
        supplies = supply.find()


        return [SupplierType(
                id = item.get('_id'),
                name = item.get('name'),
                contact_person = item.get('contact_person'),
                email = item.get('email'),
                phone = item.get('phone'),
                address = item.get('address'),
                user = item.get('user'),
                created_at = item.get('created_at'),
                updated_at = item.get('updated_at')

        ) for item in supplies]



    @strawberry.field
    async def get_supplier_autocomplete(self, search_term: str) -> List[SupplierType]:
        
        regex = re.compile(search_term, re.IGNORECASE)
        supply = mydb['inventory_supplier']
        supplies = supply.find({
            'name': {'$regex': regex}
        })

       
        
        return [SupplierType(
                id = item.get('_id'),
                name = item.get('name'),
                contact_person = item.get('contact_person'),
                email = item.get('email'),
                phone = item.get('phone'),
                address = item.get('address'),
                user = item.get('user'),
                created_at = item.get('created_at'),
                updated_at = item.get('updated_at')

         ) for item in supplies]





