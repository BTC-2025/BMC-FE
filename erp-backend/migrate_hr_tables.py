from app.core.database import engine, Base
from app.hrm.models import Appraisal, JobPosting, Application

def migrate():
    print("Creating new HR tables...")
    try:
        # This will create any missing tables defined in the models
        Base.metadata.create_all(bind=engine)
        print("Successfully created Appraisals, JobPostings, and Applications tables.")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    migrate()
