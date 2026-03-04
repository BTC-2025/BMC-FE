from app.core.database import SessionLocal
from app.scm.models import Supplier, PurchaseOrder, PurchaseOrderItem, GoodsReceipt
from app.inventory.models import Item, Warehouse, StockMovement
from app.inventory.service import get_current_stock
from app.crm.models import Activity
from app.scm.service import receive_goods
from decimal import Decimal

db = SessionLocal()

try:
    print("--- SCM Sanity Test Starting ---")
    
    # 0. Setup Warehouse and Item
    wh = db.query(Warehouse).first()
    if not wh:
        wh = Warehouse(name="Main Warehouse")
        db.add(wh)
        db.commit()
        db.refresh(wh)
    
    item = db.query(Item).first()
    if not item:
        item = Item(name="Raw Steel", sku="STL-001", unit="KG")
        db.add(item)
        db.commit()
        db.refresh(item)
    
    item_id = item.id
    warehouse_id = wh.id
    
    initial_stock = get_current_stock(db, item_id, warehouse_id)
    print(f"Initial Stock: {initial_stock}")

    # 1. Create Supplier
    supplier = Supplier(name="Steel Co", email="sales@steel.co")
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    print(f"✅ Supplier Created: {supplier.name}")

    # 2. Create PO
    po = PurchaseOrder(supplier_id=supplier.id, status="APPROVED")
    db.add(po)
    db.commit()
    db.refresh(po)
    
    po_item = PurchaseOrderItem(
        purchase_order_id=po.id,
        item_id=item_id,
        quantity_ordered=100,
        quantity_received=0
    )
    db.add(po_item)
    db.commit()
    db.refresh(po)
    print(f"✅ PO Created and Approved: ID {po.id}")

    # 3. Receive Goods
    print("Receiving Goods...")
    grn = receive_goods(db, purchase_order_id=po.id, warehouse_id=warehouse_id, performed_by=1)
    
    # 4. Verifications
    db.refresh(po)
    current_stock = get_current_stock(db, item_id, warehouse_id)
    
    print("\n--- Verification ---")
    
    # Stock Check
    if current_stock == initial_stock + 100:
        print(f"✅ Inventory Stock Updated: {current_stock}")
    else:
        print(f"❌ Inventory Stock Mismatch: {current_stock}")

    # PO Status Check
    if po.status == "CLOSED":
        print(f"✅ PO Status Updated to CLOSED")
    else:
        print(f"❌ PO Status Mismatch: {po.status}")

    # GRN Check
    if grn:
        print(f"✅ GRN Record Created: ID {grn.id}")

    # Activity Log Check
    activity = db.query(Activity).filter(Activity.type == "GOODS_RECEIVED", Activity.note.contains(str(po.id))).first()
    if activity:
        print(f"✅ Activity Logged: {activity.note}")
    else:
        print(f"❌ Activity Log missing")

    # Stock Movement Check
    movement = db.query(StockMovement).filter(StockMovement.reference == f"GRN-PO-{po.id}").first()
    if movement:
        print(f"✅ Stock Movement Recorded: {movement.quantity} {movement.movement_type}")

finally:
    db.close()
    print("\n--- SCM Sanity Test Complete ---")
