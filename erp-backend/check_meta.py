import os
import sys
sys.path.append(os.getcwd())

from app.core.database import Base
from app.core.tenant.models import Tenant
from app.scm.models import Shipment

print("Tables in metadata:")
for table in Base.metadata.tables:
    print(f" - {table}")
