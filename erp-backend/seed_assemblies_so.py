from app.core.database import SessionLocal, engine
from app.inventory.models import Item, Assembly, AssemblyBOM, Warehouse
from app.inventory.service import create_stock_movement
from app.scm.models import SalesOrder, SalesOrderItem
from app.core.tenant.models import Tenant

def seed():
    db = SessionLocal()
    tenant = db.query(Tenant).first()
    if not tenant:
        print("No tenant found. Please run seed.py first.")
        return

    # Find or create a test item
    pc = db.query(Item).filter(Item.tenant_id == tenant.id).first()
    if not pc:
        print("No items found. Creating a test item...")
        pc = Item(
            tenant_id=tenant.id,
            name="Seeded Laptop",
            sku="LAP-001",
            unit="pcs",
            valuation_rate=1000.0,
            is_active=1
        )
        db.add(pc)
        db.flush()

    # Find or create a warehouse
    wh = db.query(Warehouse).filter(Warehouse.tenant_id == tenant.id).first()
    if not wh:
        wh = Warehouse(name="Main Hub", tenant_id=tenant.id)
        db.add(wh)
        db.flush()

    # Add initial stock for pc if needed
    from app.inventory.service import get_current_stock
    if get_current_stock(db, tenant.id, pc.id, wh.id) < 10:
        create_stock_movement(
            db,
            tenant_id=tenant.id,
            item_id=pc.id,
            warehouse_id=wh.id,
            quantity=100.0,
            movement_type="IN",
            performed_by=1, # Assume admin user id is 1
            reference="Initial Seed Stock"
        )

    # Create an Assembly
    bundle = Assembly(
        tenant_id=tenant.id,
        name="Tech Bundle Alpha",
        finished_item_id=pc.id
    )
    db.add(bundle)
    db.flush()

    # Add components to BOM
    bom1 = AssemblyBOM(
        tenant_id=tenant.id,
        assembly_id=bundle.id,
        component_item_id=pc.id,
        quantity=1.0
    )
    db.add(bom1)

    # Create a Sales Order
    so = SalesOrder(
        tenant_id=tenant.id,
        customer_name="Global Corp",
        status="PENDING",
        total_amount=1200.0
    )
    db.add(so)
    db.flush()

    so_item = SalesOrderItem(
        tenant_id=tenant.id,
        sales_order_id=so.id,
        item_id=pc.id,
        quantity=1.0,
        unit_price=1200.0
    )
    db.add(so_item)

    db.commit()
    print("Seeded Assembly and Sales Order successfully.")
    db.close()

if __name__ == "__main__":
    seed()
