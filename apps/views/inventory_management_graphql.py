import strawberry
from typing import List, Optional
from datetime import datetime
from ..database.mongodb import create_mongo_client
from ..authentication.authenticate_user import get_current_user
from strawberry.types import Info
from bson import ObjectId

@strawberry.type
class Transaction:
    id: Optional[str]
    item_code: str
    item_name: str
    quantity: float
    transaction_type: str
    transaction_date: datetime
    remarks: str
    department: str
    created_at: datetime
    updated_at: datetime

@strawberry.input
class TransactionItemInput:
    itemName: str
    itemCode: str
    quantity: float
    transactionType: str
    transactionDate: datetime
    remarks: str
    department: str

@strawberry.input
class UpdateTransactionInput:
    itemName: Optional[str] = None
    itemCode: Optional[str] = None
    quantity: Optional[float] = None
    transactionType: Optional[str] = None
    transactionDate: Optional[datetime] = None
    remarks: Optional[str] = None
    department: Optional[str] = None

@strawberry.type
class Query:
    @strawberry.field
    async def get_inventory_transactions(self) -> List[Transaction]:
        mydb = create_mongo_client()
        transaction_collection = mydb['inventory_transactions']
        transactions = transaction_collection.find()
        return [Transaction(
            id=str(transaction.get('_id')),
            item_code=transaction.get('item_code'),
            item_name=transaction.get('item_name'),
            quantity=transaction.get('quantity'),
            transaction_type=transaction.get('transaction_type'),
            transaction_date=transaction.get('transaction_date'),
            remarks=transaction.get('remarks'),
            department=transaction.get('department'),
            created_at=transaction.get('created_at'),
            updated_at=transaction.get('updated_at')
        ) for transaction in transactions]

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def manage_inventory_transaction(self,info: Info, transaction_items: List[TransactionItemInput]) -> str:
        request = info.context['request']
        username = get_current_user(request)
        mydb = create_mongo_client()

        if username:
            try:

                transaction_collection = mydb['inventory_transactions']
                
                transactions_to_insert = []
                for item in transaction_items:
                    transactions_to_insert.append({
                        'item_code': item.itemCode,
                        'item_name': item.itemName,
                        'quantity': item.quantity,
                        'transaction_type': item.transactionType,
                        'transaction_date': item.transactionDate,
                        'department': item.department,
                        'remarks': item.remarks,
                        'username': username,
                        'created_at': datetime.now(),
                        'updated_at': datetime.now()
                    })

                if transactions_to_insert:
                    try:
                        print(f"Inserting {len(transactions_to_insert)} documents into inventory_transactions")
                        transaction_collection.insert_many(transactions_to_insert)
                        print("Successfully inserted documents")
                    except Exception as e:
                        print(f"Error inserting documents into inventory_transactions: {e}")
                        return f"Error: {e}"

                return "Inventory transactions recorded successfully."

            except Exception as e:
                return f"Unexpected Error: {str(e)}"

    @strawberry.mutation
    async def update_inventory_transaction(self, info: Info, transaction_id: str, update_data: UpdateTransactionInput) -> str:
        request = info.context['request']
        username = get_current_user(request)
        mydb = create_mongo_client()

        if username:
            try:
                transaction_collection = mydb['inventory_transactions']
                
                update_fields = {k: v for k, v in update_data.__dict__.items() if v is not None}
                if not update_fields:
                    return "No update data provided."

                update_fields['updated_at'] = datetime.now()

                result = transaction_collection.update_one(
                    {'_id': ObjectId(transaction_id)},
                    {'$set': update_fields}
                )

                if result.modified_count == 1:
                    return "Transaction updated successfully."
                else:
                    return "Transaction not found or not updated."

            except Exception as e:
                return f"Unexpected Error: {str(e)}"
        else:
            return "User not authenticated."
