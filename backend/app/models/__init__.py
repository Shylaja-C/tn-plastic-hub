"""
Import all models so that SQLAlchemy / Alembic can discover them via Base.metadata.
"""

from app.models.user import User, UserRole, UserStatus  # noqa: F401
from app.models.company import Company, CompanyType, CompanyStatus  # noqa: F401
from app.models.internship import Internship, InternshipStatus, InternshipType  # noqa: F401
from app.models.industrial_visit import IndustrialVisit, IndustrialVisitBooking, VisitStatus, BookingStatus  # noqa: F401
from app.models.application import Application, ApplicationStatus  # noqa: F401
from app.models.scheme import Scheme, SchemeCategory, SchemeStatus  # noqa: F401
from app.models.loan import Loan, LoanCategory, LoanStatus  # noqa: F401
from app.models.contact import Contact, ContactStatus, ContactCategory  # noqa: F401
from app.models.association import Association  # noqa: F401
from app.models.news import News, NewsCategory, NewsStatus  # noqa: F401
from app.models.technology import Technology, TechnologyCategory  # noqa: F401
from app.models.document import Document, DocumentType  # noqa: F401
from app.models.notification import Notification, NotificationType  # noqa: F401
from app.models.chat import ChatConversation, ChatMessage, MessageRole, ConversationStatus  # noqa: F401
