import os
import sys
from datetime import date, timedelta

# Add the current directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, Base, engine
from app.services.auth import hash_password

from app.models.user import User, UserRole, UserStatus
from app.models.company import Company, CompanyType, CompanyStatus
from app.models.internship import Internship, InternshipStatus, InternshipType
from app.models.application import Application, ApplicationStatus
from app.models.industrial_visit import IndustrialVisit, VisitStatus, IndustrialVisitBooking, BookingStatus
from app.models.scheme import Scheme, SchemeCategory, SchemeStatus
from app.models.loan import Loan, LoanCategory, LoanStatus
from app.models.news import News, NewsCategory, NewsStatus
from app.models.technology import Technology, TechnologyCategory
from app.models.association import Association

def seed_data():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Create users
        hashed_pw = hash_password("Test@1234")

        users_data = [
            {"email": "admin@example.com", "full_name": "Admin User", "role": UserRole.admin, "status": UserStatus.active, "is_verified": True},
            {"email": "student1@example.com", "full_name": "Student One", "role": UserRole.student, "status": UserStatus.active, "is_verified": True, "college_name": "PSG Tech", "department": "Polymer Technology"},
            {"email": "student2@example.com", "full_name": "Student Two", "role": UserRole.student, "status": UserStatus.active, "is_verified": True, "college_name": "Anna University", "department": "Mechanical Engineering"},
            {"email": "student3@example.com", "full_name": "Student Three", "role": UserRole.student, "status": UserStatus.active, "is_verified": True, "college_name": "CIPET Chennai", "department": "Plastics Engineering"},
            {"email": "industry1@example.com", "full_name": "Industry One", "role": UserRole.industry, "status": UserStatus.active, "is_verified": True},
            {"email": "industry2@example.com", "full_name": "Industry Two", "role": UserRole.industry, "status": UserStatus.active, "is_verified": True},
            {"email": "entrepreneur1@example.com", "full_name": "Entrepreneur One", "role": UserRole.entrepreneur, "status": UserStatus.active, "is_verified": True},
        ]
        
        users_created = 0
        user_map = {}
        for ud in users_data:
            user = db.query(User).filter_by(email=ud["email"]).first()
            if not user:
                user = User(hashed_password=hashed_pw, **ud)
                db.add(user)
                users_created += 1
            user_map[ud["email"]] = user
        db.commit()

        # Create companies
        companies_data = [
            {"name": "Coimbatore Plastics", "owner_email": "industry1@example.com", "company_type": CompanyType.manufacturer, "status": CompanyStatus.verified, "city": "Coimbatore", "state": "Tamil Nadu"},
            {"name": "Chennai Polymers", "owner_email": "industry1@example.com", "company_type": CompanyType.recycler, "status": CompanyStatus.verified, "city": "Chennai", "state": "Tamil Nadu"},
            {"name": "Hosur Synthetics", "owner_email": "industry2@example.com", "company_type": CompanyType.supplier, "status": CompanyStatus.pending, "city": "Hosur", "state": "Tamil Nadu"},
        ]
        
        companies_created = 0
        company_map = {}
        for cd in companies_data:
            company = db.query(Company).filter_by(name=cd["name"]).first()
            if not company:
                owner = user_map.get(cd.pop("owner_email"))
                cd["owner_id"] = owner.id
                company = Company(**cd)
                db.add(company)
                companies_created += 1
            else:
                cd.pop("owner_email")
            company_map[company.name] = company
        db.commit()

        # Create internships
        internships_data = [
            {"title": "Production Intern", "company_name": "Coimbatore Plastics", "status": InternshipStatus.open, "internship_type": InternshipType.full_time, "stipend_amount": 10000, "duration_months": 3, "vacancies": 2, "application_deadline": date.today() + timedelta(days=30), "skills_required": "Injection Molding, QC"},
            {"title": "Polymer Testing Trainee", "company_name": "Coimbatore Plastics", "status": InternshipStatus.closed, "internship_type": InternshipType.full_time, "stipend_amount": 8000, "duration_months": 2, "vacancies": 1, "application_deadline": date.today() - timedelta(days=5), "skills_required": "Material Testing"},
            {"title": "Recycling Operations Intern", "company_name": "Chennai Polymers", "status": InternshipStatus.open, "internship_type": InternshipType.hybrid, "stipend_amount": 15000, "duration_months": 6, "vacancies": 3, "application_deadline": date.today() + timedelta(days=45), "skills_required": "Waste Management"},
            {"title": "Marketing Intern", "company_name": "Chennai Polymers", "status": InternshipStatus.open, "internship_type": InternshipType.remote, "stipend_amount": 5000, "duration_months": 3, "vacancies": 1, "application_deadline": date.today() + timedelta(days=15), "skills_required": "Digital Marketing, B2B"},
            {"title": "Supply Chain Intern", "company_name": "Hosur Synthetics", "status": InternshipStatus.open, "internship_type": InternshipType.part_time, "stipend_amount": 7000, "duration_months": 4, "vacancies": 2, "application_deadline": date.today() + timedelta(days=20), "skills_required": "Logistics"},
            {"title": "R&D Intern", "company_name": "Hosur Synthetics", "status": InternshipStatus.closed, "internship_type": InternshipType.full_time, "stipend_amount": 12000, "duration_months": 6, "vacancies": 1, "application_deadline": date.today() - timedelta(days=10), "skills_required": "Polymer Chemistry"},
        ]
        
        internships_created = 0
        internship_map = {}
        for ind in internships_data:
            internship = db.query(Internship).filter_by(title=ind["title"]).first()
            if not internship:
                company = company_map.get(ind.pop("company_name"))
                ind["company_id"] = company.id
                internship = Internship(**ind)
                db.add(internship)
                internships_created += 1
            else:
                ind.pop("company_name")
            internship_map[internship.title] = internship
        db.commit()

        # Create Industrial visits
        visits_data = [
            {"title": "Coimbatore Plant Visit", "company_name": "Coimbatore Plastics", "status": VisitStatus.upcoming, "visit_date": date.today() + timedelta(days=15), "max_participants": 2},
            {"title": "Chennai Recycling Facility Tour", "company_name": "Chennai Polymers", "status": VisitStatus.upcoming, "visit_date": date.today() + timedelta(days=20), "max_participants": 30},
            {"title": "Hosur Supplier Network Visit", "company_name": "Hosur Synthetics", "status": VisitStatus.upcoming, "visit_date": date.today() + timedelta(days=25), "max_participants": 20},
            {"title": "Past Machinery Expo Visit", "company_name": "Coimbatore Plastics", "status": VisitStatus.completed, "visit_date": date.today() - timedelta(days=10), "max_participants": 40},
        ]
        
        visits_created = 0
        visit_map = {}
        for vd in visits_data:
            visit = db.query(IndustrialVisit).filter_by(title=vd["title"]).first()
            if not visit:
                company = company_map.get(vd.pop("company_name"))
                vd["company_id"] = company.id
                visit = IndustrialVisit(**vd)
                db.add(visit)
                visits_created += 1
            else:
                vd.pop("company_name")
            visit_map[visit.title] = visit
        db.commit()

        # Create Applications
        # student1 -> 2 internships (applied, shortlisted); student2 -> 1 (under_review)
        apps_data = [
            {"student_email": "student1@example.com", "internship_title": "Production Intern", "status": ApplicationStatus.applied},
            {"student_email": "student1@example.com", "internship_title": "Recycling Operations Intern", "status": ApplicationStatus.shortlisted},
            {"student_email": "student2@example.com", "internship_title": "Production Intern", "status": ApplicationStatus.under_review},
        ]
        
        apps_created = 0
        for ad in apps_data:
            student = user_map[ad["student_email"]]
            internship = internship_map[ad["internship_title"]]
            app_exists = db.query(Application).filter_by(applicant_id=student.id, internship_id=internship.id).first()
            if not app_exists:
                application = Application(applicant_id=student.id, internship_id=internship.id, status=ad["status"])
                db.add(application)
                apps_created += 1
        db.commit()

        # Create Bookings
        # student1 -> 1 visit (confirmed), student2 -> the same visit (pending)
        bookings_data = [
            {"student_email": "student1@example.com", "visit_title": "Coimbatore Plant Visit", "status": BookingStatus.confirmed},
            {"student_email": "student2@example.com", "visit_title": "Coimbatore Plant Visit", "status": BookingStatus.pending},
        ]
        
        bookings_created = 0
        for bd in bookings_data:
            student = user_map[bd["student_email"]]
            visit = visit_map[bd["visit_title"]]
            booking_exists = db.query(IndustrialVisitBooking).filter_by(student_id=student.id, visit_id=visit.id).first()
            if not booking_exists:
                booking = IndustrialVisitBooking(student_id=student.id, visit_id=visit.id, status=bd["status"])
                db.add(booking)
                bookings_created += 1
        db.commit()

        # Create Schemes
        schemes_data = [
            {"title": "TN MSME Subsidy", "category": SchemeCategory.msme, "is_featured": True},
            {"title": "Green Plastics Initiative", "category": SchemeCategory.environment, "is_featured": False},
            {"title": "Startup TN Grant", "category": SchemeCategory.startup, "is_featured": True},
            {"title": "Export Promotion Scheme", "category": SchemeCategory.export, "is_featured": False},
        ]
        schemes_created = 0
        for sd in schemes_data:
            scheme = db.query(Scheme).filter_by(title=sd["title"]).first()
            if not scheme:
                scheme = Scheme(**sd)
                db.add(scheme)
                schemes_created += 1
        db.commit()

        # Create Loans
        loans_data = [
            {"title": "TIIC Term Loan", "provider": "TIIC", "category": LoanCategory.term_loan, "is_featured": True},
            {"title": "Machinery Upgrade Loan", "provider": "SBI", "category": LoanCategory.equipment, "is_featured": False},
            {"title": "SME Working Capital", "provider": "HDFC", "category": LoanCategory.working_capital, "is_featured": True},
            {"title": "Women Entrepreneur Scheme", "provider": "Canara Bank", "category": LoanCategory.msme, "is_featured": False},
        ]
        loans_created = 0
        for ld in loans_data:
            loan = db.query(Loan).filter_by(title=ld["title"]).first()
            if not loan:
                loan = Loan(**ld)
                db.add(loan)
                loans_created += 1
        db.commit()

        # Create News
        news_data = [
            {"title": "New Polymer Park in Thiruvallur", "slug": "new-polymer-park-thiruvallur", "status": NewsStatus.published, "is_featured": True},
            {"title": "Plastics Export Grows by 15%", "slug": "plastics-export-grows-15", "status": NewsStatus.published, "is_featured": False},
            {"title": "Government Bans Single-Use Plastics", "slug": "govt-bans-single-use", "status": NewsStatus.published, "is_featured": True},
            {"title": "Coimbatore Expo 2026 Announcement", "slug": "cbe-expo-2026", "status": NewsStatus.published, "is_featured": False},
            {"title": "CIPET Launches New Training Program", "slug": "cipet-new-training", "status": NewsStatus.published, "is_featured": False},
        ]
        news_created = 0
        for nd in news_data:
            news = db.query(News).filter_by(title=nd["title"]).first()
            if not news:
                news = News(**nd)
                db.add(news)
                news_created += 1
        db.commit()

        # Create Technologies
        techs_data = [
            {"name": "Injection Molding", "category": TechnologyCategory.processing, "is_featured": True},
            {"name": "Blow Molding", "category": TechnologyCategory.processing, "is_featured": False},
            {"name": "Extrusion", "category": TechnologyCategory.processing, "is_featured": True},
            {"name": "Chemical Recycling", "category": TechnologyCategory.recycling, "is_featured": True},
            {"name": "Mechanical Recycling", "category": TechnologyCategory.recycling, "is_featured": False},
        ]
        techs_created = 0
        for td in techs_data:
            tech = db.query(Technology).filter_by(name=td["name"]).first()
            if not tech:
                tech = Technology(**td)
                db.add(tech)
                techs_created += 1
        db.commit()

        # Create Associations
        assocs_data = [
            {"name": "Tamil Nadu Plastics Manufacturers Association", "acronym": "TAPMA", "is_featured": True},
            {"name": "CIPET Alumni Association", "acronym": "CAA", "is_featured": False},
            {"name": "South India Plastics Association", "acronym": "SIPA", "is_featured": True},
        ]
        assocs_created = 0
        for ad in assocs_data:
            assoc = db.query(Association).filter_by(name=ad["name"]).first()
            if not assoc:
                assoc = Association(**ad)
                db.add(assoc)
                assocs_created += 1
        db.commit()

        print("--- Seed Summary ---")
        print(f"Users created: {users_created}")
        print(f"Companies created: {companies_created}")
        print(f"Internships created: {internships_created}")
        print(f"Visits created: {visits_created}")
        print(f"Applications created: {apps_created}")
        print(f"Bookings created: {bookings_created}")
        print(f"Schemes created: {schemes_created}")
        print(f"Loans created: {loans_created}")
        print(f"News created: {news_created}")
        print(f"Technologies created: {techs_created}")
        print(f"Associations created: {assocs_created}")
        print("\nLogin Emails (Password: Test@1234):")
        for u in users_data:
            print(f"- {u['email']} ({u['role'].value})")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
