"""
Seed default email templates
Run this after creating tables
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.notifications.models import EmailTemplate


def seed_email_templates():
    """Seed default email templates"""
    db = SessionLocal()
    
    templates = [
        {
            "name": "invoice_created",
            "subject": "Invoice #{{ invoice_id }} Created - {{ customer_name }}",
            "body_html": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .invoice-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Invoice Created</h1>
        </div>
        <div class="content">
            <p>Dear {{ customer_name }},</p>
            <p>A new invoice has been created for you.</p>
            
            <div class="invoice-details">
                <h3>Invoice Details</h3>
                <p><strong>Invoice ID:</strong> #{{ invoice_id }}</p>
                <p><strong>Amount:</strong> ${{ total_amount }}</p>
                <p><strong>Invoice Date:</strong> {{ invoice_date }}</p>
                <p><strong>Due Date:</strong> {{ due_date }}</p>
            </div>
            
            <p>Please review and process the payment at your earliest convenience.</p>
        </div>
        <div class="footer">
            <p>This is an automated message from your ERP system.</p>
        </div>
    </div>
</body>
</html>
            """,
            "body_text": "Invoice #{{ invoice_id }} created for {{ customer_name }}. Amount: ${{ total_amount }}. Due: {{ due_date }}."
        },
        {
            "name": "leave_approved",
            "subject": "Leave Request Approved - {{ employee_name }}",
            "body_html": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .leave-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Leave Approved</h1>
        </div>
        <div class="content">
            <p>Hi {{ employee_name }},</p>
            <p>Good news! Your leave request has been approved.</p>
            
            <div class="leave-details">
                <h3>Leave Details</h3>
                <p><strong>Type:</strong> {{ leave_type }}</p>
                <p><strong>From:</strong> {{ start_date }}</p>
                <p><strong>To:</strong> {{ end_date }}</p>
                <p><strong>Duration:</strong> {{ days }} day(s)</p>
            </div>
            
            <p>Enjoy your time off!</p>
        </div>
        <div class="footer">
            <p>This is an automated message from your ERP system.</p>
        </div>
    </div>
</body>
</html>
            """,
            "body_text": "Hi {{ employee_name }}, your {{ leave_type }} leave from {{ start_date }} to {{ end_date }} ({{ days }} days) has been approved."
        },
        {
            "name": "task_assigned",
            "subject": "New Task Assigned: {{ task_title }}",
            "body_html": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .task-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .priority { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
        .priority-high { background: #FEE2E2; color: #DC2626; }
        .priority-medium { background: #FEF3C7; color: #D97706; }
        .priority-low { background: #DBEAFE; color: #2563EB; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Task Assigned</h1>
        </div>
        <div class="content">
            <p>You have been assigned a new task.</p>
            
            <div class="task-details">
                <h3>{{ task_title }}</h3>
                <p><strong>Project:</strong> {{ project_name }}</p>
                <p><strong>Priority:</strong> <span class="priority priority-{{ priority|lower }}">{{ priority }}</span></p>
                <p><strong>Estimated Hours:</strong> {{ estimated_hours }}h</p>
                <p><strong>Description:</strong></p>
                <p>{{ task_description }}</p>
            </div>
            
            <p>Please review the task details and update your progress accordingly.</p>
        </div>
        <div class="footer">
            <p>This is an automated message from your ERP system.</p>
        </div>
    </div>
</body>
</html>
            """,
            "body_text": "New task assigned: {{ task_title }} in project {{ project_name }}. Priority: {{ priority }}. Estimated: {{ estimated_hours }}h."
        },
        {
            "name": "leave_rejected",
            "subject": "Leave Request Update - {{ employee_name }}",
            "body_html": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Leave Request Status</h1>
        </div>
        <div class="content">
            <p>Hi {{ employee_name }},</p>
            <p>Unfortunately, your leave request for {{ start_date }} to {{ end_date }} could not be approved at this time.</p>
            <p>Please contact your manager for more information.</p>
        </div>
        <div class="footer">
            <p>This is an automated message from your ERP system.</p>
        </div>
    </div>
</body>
</html>
            """,
            "body_text": "Hi {{ employee_name }}, your leave request for {{ start_date }} to {{ end_date }} could not be approved."
        }
    ]
    
    for template_data in templates:
        # Check if template already exists
        existing = db.query(EmailTemplate).filter(EmailTemplate.name == template_data["name"]).first()
        if not existing:
            template = EmailTemplate(**template_data)
            db.add(template)
            print(f"✓ Created template: {template_data['name']}")
        else:
            print(f"- Template already exists: {template_data['name']}")
    
    db.commit()
    db.close()
    print("\n✅ Email templates seeded successfully!")


if __name__ == "__main__":
    seed_email_templates()
