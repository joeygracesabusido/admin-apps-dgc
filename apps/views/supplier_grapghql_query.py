from datetime import datetime
from enum import unique
import strawberry

from typing import Optional,List

from apps.models.graphql_model import supplierInput


from ..database.mongodb import create_mongo_client
mydb = create_mongo_client()

import re


@strawberry.type
class Query:
    @strawberry.field
    async def getSupplierList(self) -> List[supplierInput]:
        supply = mydb['inventory_supplier']
        supplies = supply.find()


        return [InventoryItemsQuery(
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





