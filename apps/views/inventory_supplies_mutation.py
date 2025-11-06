from datetime import datetime
from enum import unique
import strawberry
from strawberry.types import Info
from strawberry import asdict
from typing import Optional, List
from bson import ObjectId
from starlette.requests import Request  # ADD THIS IMPORT
from ..authentication.authenticate_user import get_current_user
from ..database.mongodb import create_mongo_client

mydb = create_mongo_client()

@strawberry.input
class InventoryItems:
    item_code: str
    name: str
    category: str
    description: str
    quantity_in_stock: float
    unit: str
    reorder_level: int
    price_per_unit: float
    supplier_id: str
    user: Optional[str] = None
    created: Optional[datetime] = None
    updated: Optional[datetime] = None

@strawberry.input
class InventoryUpdateInput:
    id: str
    item_code: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    quantity_in_stock: Optional[float] = None
    unit: Optional[str] = None
    reorder_level: Optional[int] = None
    price_per_unit: Optional[float] = None
    supplier_id: Optional[str] = None
    user: Optional[str] = None
    updated: Optional[datetime] = None



inventory_item_collection = mydb['inventory_supply_item']
inventory_item_collection.create_index('item_code', unique=True)
inventory_item_collection.create_index('name', unique=True)

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def insert_inventory_supply_item(self, info: Info, inventory_items: InventoryItems) -> str:
        try:
            request = info.context['request']
        except (TypeError, KeyError):
            return "Request context not available"

        username = get_current_user(request)

        if username:
            try:
                data = {
                    **inventory_items.__dict__,
                    'created': inventory_items.created or datetime.utcnow(),
                    'updated': datetime.utcnow(),
                    'user': username
                }

                inventory_item_collection.insert_one(data)
                return "Items inserted"
            except Exception as e:
                return f"Unexpected Error: {str(e)}"

    @strawberry.mutation
    async def update_inventory_supply_item(self, info: Info, updated_data: InventoryUpdateInput) -> str:
        request = info.context['request']
        username = get_current_user(request)

        print(f"Update request received for ID: {updated_data.id}")
        print(f"User: {username}")
        print(f"Update data: {updated_data}")

        if not username:
            return "Authentication required"

        try:
            # Validate that the item exists
            if not ObjectId.is_valid(updated_data.id):
                print(f"Invalid ObjectId: {updated_data.id}")
                return "Invalid item ID format"

            # Build update fields - only include non-None values
            update_fields = {}
            
            if updated_data.item_code is not None:
                update_fields['item_code'] = updated_data.item_code
            if updated_data.name is not None:
                update_fields['name'] = updated_data.name
            if updated_data.category is not None:
                update_fields['category'] = updated_data.category
            if updated_data.description is not None:
                update_fields['description'] = updated_data.description
            if updated_data.quantity_in_stock is not None:
                update_fields['quantity_in_stock'] = updated_data.quantity_in_stock
            if updated_data.unit is not None:
                update_fields['unit'] = updated_data.unit
            if updated_data.reorder_level is not None:
                update_fields['reorder_level'] = updated_data.reorder_level
            if updated_data.price_per_unit is not None:
                update_fields['price_per_unit'] = updated_data.price_per_unit
            if updated_data.supplier_id is not None:
                update_fields['supplier_id'] = updated_data.supplier_id
            

            # Always update these fields
            update_fields['updated'] = datetime.utcnow()
            update_fields['user'] = username

            print(f"Update fields: {update_fields}")

            if not update_fields:
                return "No fields to update"

            # Check if item exists
            existing_item = inventory_item_collection.find_one({"_id": ObjectId(updated_data.id)})
            if not existing_item:
                print(f"Item not found with ID: {updated_data.id}")
                return "Item not found"

            print(f"Found existing item: {existing_item.get('name', 'Unknown')}")

            # Perform the update
            result = inventory_item_collection.update_one(
                {"_id": ObjectId(updated_data.id)},
                {"$set": update_fields}
            )

            print(f"Update result - matched: {result.matched_count}, modified: {result.modified_count}")

            if result.modified_count == 1:
                return "Inventory item updated successfully"
            elif result.matched_count == 1:
                return "No changes were made to the inventory item"
            else:
                return "Item not found"

        except Exception as e:
            print(f"Update error: {str(e)}")
            return f"Update Error: {str(e)}"


    @strawberry.mutation
    async def delete_inventory_supply_item(self, info: Info, item_id: str) -> str:
        request = info.context['request']
        username = get_current_user(request)

        if not username:
            return "Authentication required"

        try:
            if not ObjectId.is_valid(item_id):
                return "Invalid item ID format"

            result = inventory_item_collection.delete_one({"_id": ObjectId(item_id)})

            if result.deleted_count == 1:
                return "Inventory item deleted successfully"
            else:
                return "Item not found"

        except Exception as e:
            return f"Delete Error: {str(e)}"
