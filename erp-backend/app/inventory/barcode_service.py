from barcode import Code128
from barcode.writer import ImageWriter
from io import BytesIO

def generate_barcode(sku: str) -> bytes:
    """
    Generates a Code128 barcode as PNG bytes for a given SKU.
    """
    # Create the barcode using Code128 format
    code = Code128(sku, writer=ImageWriter())
    
    # Save to a memory buffer
    buffer = BytesIO()
    code.write(buffer)
    
    return buffer.getvalue()
