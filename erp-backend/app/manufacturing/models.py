from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(Integer, primary_key=True, index=True)
    wo_number = Column(String, unique=True, index=True, nullable=False) # e.g., "WO-1001"
    item_id = Column(Integer, nullable=True) # Output item (references inventory_items.id)
    
    quantity_planned = Column(Float, nullable=False)
    quantity_produced = Column(Float, default=0.0)
    
    status = Column(String, default="Draft") # Draft, Scheduled, In Progress, Completed, Cancelled
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    
    timestamp = Column(DateTime, default=datetime.utcnow)

class BillOfMaterials(Base):
    __tablename__ = "bom"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, nullable=True) # The finished good (references inventory_items.id)
    name = Column(String, nullable=False)
    
    components = Column(JSON) # List of component item_ids and quantities
    
    timestamp = Column(DateTime, default=datetime.utcnow)

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    type = Column(String)
    status = Column(String, default="Idle") # Idle, Running, Maintenance, Down
    
    last_maintenance = Column(DateTime)
