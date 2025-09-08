import strawberry
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from strawberry.types import Info
from ..database.mongodb import create_mongo_client
from ..authentication.authenticate_user import get_current_user
from ..grapql_models.graphqlModel import SupplierInput, SupplierUpdateInput

mydb = create_mongo_client()

@strawberry.type
class SupplierMutation:
    @strawberry.mutation
    async def insertSupplierIvtSupply(self, info: Info, intSupplier: SupplierInput) -> str:
        request = info.context['request']
        username = get_current_user(request)

        if username:
            try:
                supplier_collection = mydb['inventory_supplier']
                supplier_data = intSupplier.__dict__
                supplier_data['user'] = username
                supplier_data['created_at'] = datetime.utcnow()
                supplier_data['updated_at'] = datetime.utcnow()
                result = supplier_collection.insert_one(supplier_data)
                if result.inserted_id:
                    return f"Supplier inserted with ID: {result.inserted_id}"
                else:
                    return "Failed to insert supplier"
            except Exception as e:
                return f"Error: {e}"
        else:
            return "User not authenticated"

    @strawberry.mutation
    async def updateSupplierIvtSupply(self, info: Info, updatedData: SupplierUpdateInput) -> str:
        request = info.context['request']
        username = get_current_user(request)

        if username:
            try:
                supplier_collection = mydb['inventory_supplier']
                supplier_id = updatedData.id
                update_data = {k: v for k, v in updatedData.__dict__.items() if v is not None and k != 'id'}
                update_data['updated_at'] = datetime.utcnow()

                result = supplier_collection.update_one(
                    {"_id": ObjectId(supplier_id)},
                    {"$set": update_data}
                )

                if result.modified_count:
                    return "Supplier updated successfully"
                else:
                    return "Supplier not found or no changes made"
            except Exception as e:
                return f"Error: {e}"
        else:
            return "User not authenticated"
