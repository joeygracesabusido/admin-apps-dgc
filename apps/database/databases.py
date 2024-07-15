from typing import Optional,List
from pydantic import condecimal
from sqlmodel import Field, Session, SQLModel, create_engine,select,func,funcfilter,within_group,Relationship

from datetime import datetime, date


import urllib.parse


class connectionDB:

    def conn():
        pass


        engine = create_engine(connection_string, echo=True)
        return engine