from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import os
import asyncio
import logging
from datetime import datetime
import uuid
from dotenv import load_dotenv

from services.supabase_client import SupabaseClient
from services.email_service import EmailService
from services.template_service import TemplateService
from models.schemas import (
    CampaignCreate,
    EmailTarget,
    EmailTemplate,
    CampaignResponse,
    TrackingEvent,
)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AICDAP Backend",
    description="AI-powered Cybersecurity Defense and Awareness Platform Backend",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
supabase_client = SupabaseClient()
email_service = EmailService()
template_service = TemplateService()

# Mount static files and templates
templates = Jinja2Templates(directory="templates")


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting AICDAP Backend...")
    await supabase_client.initialize()
    await email_service.initialize()
    logger.info("AICDAP Backend started successfully")


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "AICDAP Backend API", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "supabase": await supabase_client.health_check(),
            "email": await email_service.health_check(),
        },
    }


@app.post("/api/campaigns/launch", response_model=CampaignResponse)
async def launch_campaign(
    campaign_data: CampaignCreate, background_tasks: BackgroundTasks
):
    """Launch a phishing campaign"""
    try:
        logger.info(f"Launching campaign: {campaign_data.name}")

        # Get campaign details from database
        campaign = await supabase_client.get_campaign(campaign_data.campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")

        # Get target employees
        targets = await supabase_client.get_campaign_targets(campaign_data.campaign_id)
        if not targets:
            raise HTTPException(status_code=400, detail="No targets found for campaign")

        # Get email template
        template = template_service.get_template(campaign.get("template_id"))
        if not template:
            raise HTTPException(status_code=400, detail="Email template not found")

        # Start email sending in background
        background_tasks.add_task(send_campaign_emails, campaign, targets, template)

        # Update campaign status
        await supabase_client.update_campaign_status(
            campaign_data.campaign_id, "active"
        )

        return CampaignResponse(
            campaign_id=campaign_data.campaign_id,
            status="launched",
            message="Campaign launched successfully",
            targets_count=len(targets),
        )

    except Exception as e:
        logger.error(f"Error launching campaign: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


async def send_campaign_emails(campaign: Dict, targets: List[Dict], template: Dict):
    """Send emails to all targets in a campaign"""
    try:
        logger.info(f"Sending emails for campaign: {campaign['name']}")

        sent_count = 0
        failed_count = 0

        for target in targets:
            try:
                # Generate tracking URLs
                tracking_id = str(uuid.uuid4())
                tracking_urls = {
                    "open": f"http://localhost:8000/track/open/{tracking_id}",
                    "click": f"http://localhost:8000/track/click/{tracking_id}",
                    "landing": f"http://localhost:8000/landing/{template['template_id']}/{tracking_id}",
                }

                # Personalize email content
                personalized_content = template_service.personalize_template(
                    template, target, tracking_urls
                )

                # Send email
                success = await email_service.send_email(
                    to_email=target["email"],
                    subject=personalized_content["subject"],
                    html_content=personalized_content["html"],
                    tracking_id=tracking_id,
                )

                if success:
                    sent_count += 1
                    # Update target status in database
                    await supabase_client.update_target_status(
                        target["id"],
                        "sent",
                        tracking_id=tracking_id,
                        metadata={
                            "sent_at": datetime.utcnow().isoformat(),
                        },
                    )
                else:
                    failed_count += 1
                    await supabase_client.update_target_status(
                        target["id"], "failed", {"error": "Failed to send email"}
                    )

                # Small delay to avoid rate limiting
                await asyncio.sleep(0.1)

            except Exception as e:
                logger.error(f"Error sending email to {target['email']}: {str(e)}")
                failed_count += 1
                await supabase_client.update_target_status(
                    target["id"], "failed", {"error": str(e)}
                )

        # Update campaign statistics
        await supabase_client.update_campaign_stats(
            campaign["id"],
            {
                "total_sent": sent_count,
                "status": "active" if sent_count > 0 else "failed",
            },
        )

        logger.info(
            f"Campaign {campaign['name']} completed. Sent: {sent_count}, Failed: {failed_count}"
        )

    except Exception as e:
        logger.error(f"Error in send_campaign_emails: {str(e)}")
        await supabase_client.update_campaign_status(campaign["id"], "failed")


@app.get("/api/templates")
async def get_templates():
    """Get all available email templates"""
    templates = template_service.get_all_templates()
    return {"templates": templates}


@app.get("/api/templates/{template_id}")
async def get_template(template_id: int):
    """Get a specific email template"""
    template = template_service.get_template(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@app.get("/track/open/{tracking_id}")
async def track_email_open(tracking_id: str):
    """Track email opens"""
    try:
        await supabase_client.record_tracking_event(
            tracking_id, "opened", {"timestamp": datetime.utcnow().isoformat()}
        )

        # Return 1x1 transparent pixel
        return HTMLResponse(
            content='<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">',
            media_type="image/gif",
        )
    except Exception as e:
        logger.error(f"Error tracking email open: {str(e)}")
        return HTMLResponse(content="", status_code=200)


@app.get("/track/click/{tracking_id}")
async def track_email_click(tracking_id: str):
    """Track email clicks"""
    try:
        campaign_id = await supabase_client.record_tracking_event(
            tracking_id, "clicked", {"timestamp": datetime.utcnow().isoformat()}
        )

        if campaign_id:
            # Update campaign stats
            stats = await supabase_client.get_campaign_stats(campaign_id)
            await supabase_client.update_campaign_stats(campaign_id, stats)

        # Redirect to landing page
        return RedirectResponse(url=f"/landing/generic/{tracking_id}")

    except Exception as e:
        logger.error(f"Error tracking email click: {str(e)}")
        return RedirectResponse(url="/landing/generic/error")


@app.get("/landing/{template_id}/{tracking_id}", response_class=HTMLResponse)
async def phishing_landing_page(template_id: str, tracking_id: str):
    """Serve phishing landing pages"""
    try:
        # Record landing page visit
        await supabase_client.record_tracking_event(
            tracking_id,
            "landed",
            {"timestamp": datetime.utcnow().isoformat(), "template_id": template_id},
        )

        # Get landing page template
        landing_template = template_service.get_landing_template(template_id)
        if not landing_template:
            template_id = "generic"
            landing_template = template_service.get_landing_template("generic")

        return HTMLResponse(content=landing_template, status_code=200)

    except Exception as e:
        logger.error(f"Error serving landing page: {str(e)}")
        return HTMLResponse(content="<h1>Page not found</h1>", status_code=404)


@app.post("/landing/{template_id}/{tracking_id}/submit")
async def handle_landing_submission(
    template_id: str, tracking_id: str, form_data: Dict[str, Any]
):
    """Handle form submissions from landing pages"""
    try:
        # Record form submission
        await supabase_client.record_tracking_event(
            tracking_id,
            "submitted",
            {
                "timestamp": datetime.utcnow().isoformat(),
                "template_id": template_id,
                "form_data": form_data,
                "ip_address": form_data.get("ip_address"),
                "user_agent": form_data.get("user_agent"),
            },
        )

        # Return success response or redirect to awareness page
        return {
            "status": "success",
            "message": "Thank you for participating in this security awareness training",
            "redirect": "/awareness",
        }

    except Exception as e:
        logger.error(f"Error handling form submission: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/awareness", response_class=HTMLResponse)
async def awareness_page():
    """Security awareness education page"""
    return templates.TemplateResponse("awareness.html", {"request": {}})


@app.get("/api/campaigns/{campaign_id}/stats")
async def get_campaign_stats(campaign_id: str):
    """Get campaign statistics"""
    try:
        stats = await supabase_client.get_campaign_stats(campaign_id)
        return stats
    except Exception as e:
        logger.error(f"Error getting campaign stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/campaigns/{campaign_id}/report")
async def report_phishing_email(campaign_id: str, tracking_id: str):
    """Handle phishing email reports"""
    try:
        await supabase_client.record_tracking_event(
            tracking_id,
            "reported",
            {"timestamp": datetime.utcnow().isoformat(), "campaign_id": campaign_id},
        )

        return {
            "status": "success",
            "message": "Thank you for reporting this suspicious email!",
        }

    except Exception as e:
        logger.error(f"Error recording email report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST", "localhost"),
        port=int(os.getenv("APP_PORT", 8000)),
        reload=os.getenv("DEBUG", "False").lower() == "true",
    )
