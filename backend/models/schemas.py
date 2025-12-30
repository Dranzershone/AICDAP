from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum


class CampaignStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    SENDING = "sending"


class TargetStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    OPENED = "opened"
    CLICKED = "clicked"
    SUBMITTED = "submitted"
    REPORTED = "reported"
    FAILED = "failed"


class TrackingEventType(str, Enum):
    OPENED = "opened"
    CLICKED = "clicked"
    LANDED = "landed"
    SUBMITTED = "submitted"
    REPORTED = "reported"


class EmailTarget(BaseModel):
    id: str
    email: EmailStr
    name: str
    department: Optional[str] = None
    employee_id: str
    campaign_target_id: str


class EmailTemplate(BaseModel):
    template_id: int
    name: str
    type: str
    difficulty: str
    description: str
    subject: str
    html_content: str
    landing_page_url: Optional[str] = None
    preview: str


class CampaignTarget(BaseModel):
    id: str
    department: str
    employee_count: int
    employees: List[EmailTarget]


class CampaignCreate(BaseModel):
    campaign_id: str = Field(..., description="ID of the campaign to launch")
    name: str = Field(..., description="Campaign name")
    description: Optional[str] = None
    template_id: int = Field(..., description="Email template ID to use")
    delay_minutes: Optional[int] = Field(
        default=0, description="Delay before sending emails"
    )


class CampaignResponse(BaseModel):
    campaign_id: str
    status: str
    message: str
    targets_count: int
    sent_at: Optional[datetime] = None


class TrackingEvent(BaseModel):
    id: Optional[str] = None
    tracking_id: str
    event_type: TrackingEventType
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class CampaignStats(BaseModel):
    campaign_id: str
    total_targets: int
    total_sent: int
    total_opened: int
    total_clicked: int
    total_submitted: int
    total_reported: int
    total_failed: int
    open_rate: float
    click_rate: float
    submit_rate: float
    report_rate: float
    last_updated: datetime


class EmployeeTarget(BaseModel):
    id: str
    name: str
    email: EmailStr
    department: str
    status: str = "active"


class DepartmentSummary(BaseModel):
    department: str
    employee_count: int
    employees: List[EmployeeTarget]


class EmailSendRequest(BaseModel):
    to_email: EmailStr
    subject: str
    html_content: str
    tracking_id: str
    from_name: Optional[str] = "Security Team"


class EmailSendResponse(BaseModel):
    success: bool
    message: str
    message_id: Optional[str] = None
    tracking_id: str


class LandingPageSubmission(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    additional_data: Optional[Dict[str, str]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class HealthCheck(BaseModel):
    service: str
    status: str
    timestamp: datetime
    details: Optional[Dict[str, Any]] = None


class APIError(BaseModel):
    error: str
    message: str
    timestamp: datetime
    details: Optional[Dict[str, Any]] = None


class TemplatePreview(BaseModel):
    template_id: int
    name: str
    subject: str
    preview_text: str
    difficulty: str
    html_preview: str


class CampaignLaunchRequest(BaseModel):
    name: str
    description: Optional[str] = None
    template_id: int
    target_departments: List[str]
    delay_minutes: Optional[int] = 0
    from_name: Optional[str] = "Security Team"
    from_email: Optional[EmailStr] = None


class TrackingPixelResponse(BaseModel):
    success: bool
    tracking_id: str
    event_recorded: bool


class ReportPhishingRequest(BaseModel):
    tracking_id: str
    additional_info: Optional[str] = None
    user_feedback: Optional[str] = None


class CampaignListResponse(BaseModel):
    campaigns: List[Dict[str, Any]]
    total_count: int
    page: int
    page_size: int


class EmailDeliveryStatus(BaseModel):
    tracking_id: str
    status: str  # sent, delivered, bounced, failed
    timestamp: datetime
    error_message: Optional[str] = None


class TemplatePersonalization(BaseModel):
    employee_name: str
    employee_email: EmailStr
    department: str
    company_name: Optional[str] = "Your Organization"
    tracking_urls: Dict[str, str]


class URLAnalysisRequest(BaseModel):
    url: str = Field(..., description="URL to analyze for phishing")


class URLAnalysisResponse(BaseModel):
    url: str
    is_phishing: bool
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    risk_level: str = Field(
        ..., description="Risk level: low, low-medium, medium, high"
    )
    reason: str = Field(..., description="Human-readable explanation")
    details: Dict[str, Any] = Field(..., description="Additional analysis details")
    analyzed_at: datetime = Field(default_factory=datetime.now)


class URLAnalysisHistory(BaseModel):
    id: str
    url: str
    is_phishing: bool
    confidence_score: float
    risk_level: str
    analyzed_at: datetime
    user_id: Optional[str] = None
    ip_address: Optional[str] = None


class BulkURLAnalysisRequest(BaseModel):
    urls: List[str] = Field(
        ..., max_items=50, description="List of URLs to analyze (max 50)"
    )


class BulkURLAnalysisResponse(BaseModel):
    results: List[URLAnalysisResponse]
    total_analyzed: int
    total_phishing: int
    total_safe: int
    analysis_summary: Dict[str, int] = Field(..., description="Summary by risk level")
