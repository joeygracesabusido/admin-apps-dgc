import strawberry
from fastapi import FastAPI, Request
from strawberry.fastapi import GraphQLRouter




from apps.views.graphql_views import Query as BasicQuery


from apps.views.get_inventory_query  import Query as GetInventory
from apps.views.supplier_grapghql_query import Query as getSupplier

from ..views.inventory_management_graphql import Query as get_inventory_transactions

#from apps.views.mutation import Mutation

 
from ..views.inventory_management_graphql import Mutation as manage_inventory_transaction

from apps.views.inventory_supplies_mutation import Mutation as InsertItems
from ..views.supplier_invt_supply import insertSupplierInvt
from ..views.supplier_mutation import SupplierMutation


async def get_context(request: Request):
	"""Attach the FastAPI request to the Strawberry context."""
	return {'request': request }





@strawberry.type
class Query(BasicQuery, GetInventory, getSupplier, get_inventory_transactions) :
    pass

@strawberry.type
class Mutation(InsertItems, insertSupplierInvt, manage_inventory_transaction, SupplierMutation):
    pass

# Create a Strawberry schema:w
schema = strawberry.Schema(query=Query,mutation=Mutation)
 
graphql_app = GraphQLRouter(schema, context_getter=get_context)





# graphql_app = GraphQLRouter(schema, context_getter=get_context)



