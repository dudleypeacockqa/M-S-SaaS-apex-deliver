"""
PMI Report Service - PDF report generation for Post-Merger Integration
Uses WeasyPrint for HTML to PDF conversion
"""

from __future__ import annotations

import io
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from decimal import Decimal

try:
    from weasyprint import HTML, CSS
    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError):
    # OSError can occur if system libraries (libgobject, libpango, etc.) are missing
    HTML = None
    CSS = None
    WEASYPRINT_AVAILABLE = False

from app.services import pmi_service, pmi_ai_service
from app.services.storage_service import get_storage_service
from app.core.config import get_settings
from sqlalchemy.orm import Session


class PMIReportService:
    """Service for generating PMI reports in PDF format."""

    @staticmethod
    async def generate_status_report_pdf(
        project_id: str,
        organization_id: str,
        db: Session,
    ) -> Dict[str, Any]:
        """
        Generate comprehensive PMI status report PDF.
        
        Args:
            project_id: PMI project ID
            organization_id: Organization ID
            db: Database session
            
        Returns:
            Dictionary with file_path, download_url, and file_size_bytes
        """
        if not WEASYPRINT_AVAILABLE:
            raise ImportError("weasyprint is not installed. Install with: pip install weasyprint")
        
        # Get project data
        project = pmi_service.get_pmi_project_by_id(project_id, organization_id, db)
        if not project:
            raise ValueError(f"PMI project {project_id} not found")
        
        dashboard = pmi_service.get_pmi_dashboard(project_id, organization_id, db)
        workstreams = pmi_service.list_workstreams(project_id, organization_id, db)
        synergies = pmi_service.list_synergies(project_id, organization_id, db)
        risks = pmi_service.list_risks(project_id, organization_id, db)
        checklist_items = pmi_service.list_day_one_checklist(project_id, organization_id, db)
        
        # Generate AI executive summary
        try:
            executive_summary = await pmi_ai_service.generate_best_practices(
                project.current_phase.value if project.current_phase else "stabilization"
            )
            summary_text = executive_summary.get("recommended_actions", [])
            if isinstance(summary_text, list):
                summary_text = "\n".join([f"- {action}" for action in summary_text[:5]])
            else:
                summary_text = str(summary_text)
        except Exception:
            summary_text = "Executive summary generation temporarily unavailable."
        
        # Generate HTML content
        html_content = PMIReportService._generate_status_report_html(
            project=project,
            dashboard=dashboard,
            workstreams=workstreams,
            synergies=synergies,
            risks=risks,
            checklist_items=checklist_items,
            executive_summary=summary_text,
        )
        
        # Convert to PDF
        pdf_bytes = PMIReportService._html_to_pdf(html_content)
        
        # Save to storage
        storage_service = get_storage_service()
        file_key = storage_service.generate_file_key(
            organization_id=organization_id,
            deal_id=project.deal_id,
            filename=f"pmi-status-report-{project_id}-{datetime.now(timezone.utc).strftime('%Y%m%d')}.pdf",
            user_id=organization_id,
        )
        
        file_stream = io.BytesIO(pdf_bytes)
        file_path = await storage_service.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=organization_id,
        )
        
        # Construct download URL
        settings = get_settings()
        api_base_url = getattr(settings, 'api_base_url', None) or "https://ma-saas-backend.onrender.com"
        download_url = f"{api_base_url}/api/pmi/projects/{project_id}/reports/download/{file_key}"
        
        return {
            "file_path": file_key,
            "download_url": download_url,
            "file_size_bytes": len(pdf_bytes),
            "file_type": "application/pdf",
        }

    @staticmethod
    def _generate_status_report_html(
        project,
        dashboard,
        workstreams,
        synergies,
        risks,
        checklist_items,
        executive_summary: str,
    ) -> str:
        """Generate HTML content for status report."""
        days_into_pmi = (datetime.now(timezone.utc) - project.close_date).days if project.close_date else 0
        days_remaining = (project.target_completion_date - datetime.now(timezone.utc)).days if project.target_completion_date else 0
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>PMI Status Report - {project.name}</title>
            <style>
                @page {{
                    size: A4;
                    margin: 2cm;
                }}
                body {{
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                    line-height: 1.6;
                }}
                .cover-page {{
                    text-align: center;
                    page-break-after: always;
                    padding-top: 100px;
                }}
                .cover-page h1 {{
                    color: #1e40af;
                    font-size: 32px;
                    margin-bottom: 20px;
                }}
                .cover-page .subtitle {{
                    color: #666;
                    font-size: 18px;
                    margin-bottom: 40px;
                }}
                .cover-page .meta {{
                    margin-top: 60px;
                    color: #888;
                }}
                h1 {{
                    color: #1e40af;
                    border-bottom: 3px solid #1e40af;
                    padding-bottom: 10px;
                    margin-top: 30px;
                }}
                h2 {{
                    color: #3b82f6;
                    margin-top: 25px;
                    font-size: 20px;
                }}
                h3 {{
                    color: #60a5fa;
                    margin-top: 20px;
                    font-size: 16px;
                }}
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    font-size: 12px;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }}
                th {{
                    background-color: #f3f4f6;
                    font-weight: bold;
                    color: #1e40af;
                }}
                .metric-box {{
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                    padding: 15px;
                    margin: 10px 0;
                }}
                .metric-label {{
                    font-weight: bold;
                    color: #6b7280;
                    font-size: 12px;
                }}
                .metric-value {{
                    font-size: 24px;
                    color: #1e40af;
                    font-weight: bold;
                }}
                .status-badge {{
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                }}
                .status-completed {{
                    background-color: #d1fae5;
                    color: #065f46;
                }}
                .status-in-progress {{
                    background-color: #dbeafe;
                    color: #1e40af;
                }}
                .status-at-risk {{
                    background-color: #fef3c7;
                    color: #92400e;
                }}
                .severity-high {{
                    background-color: #fee2e2;
                    color: #991b1b;
                }}
                .severity-medium {{
                    background-color: #fef3c7;
                    color: #92400e;
                }}
                .severity-low {{
                    background-color: #d1fae5;
                    color: #065f46;
                }}
            </style>
        </head>
        <body>
            <!-- Cover Page -->
            <div class="cover-page">
                <h1>PMI Status Report</h1>
                <div class="subtitle">{project.name}</div>
                <div class="meta">
                    <p>Generated: {datetime.now(timezone.utc).strftime('%B %d, %Y at %H:%M UTC')}</p>
                    <p>Project Status: {project.status.value}</p>
                    <p>Current Phase: {project.current_phase.value if project.current_phase else 'N/A'}</p>
                </div>
            </div>
            
            <!-- Executive Summary -->
            <h1>Executive Summary</h1>
            <div class="metric-box">
                <div class="metric-label">Days into PMI</div>
                <div class="metric-value">{days_into_pmi}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Days Remaining (100-Day Plan)</div>
                <div class="metric-value">{days_remaining}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Synergy Realization Rate</div>
                <div class="metric-value">{dashboard.synergy_realization_rate:.1f}%</div>
            </div>
            <p>{executive_summary}</p>
            
            <!-- Workstream Progress -->
            <h1>Workstream Progress</h1>
            <table>
                <thead>
                    <tr>
                        <th>Workstream</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Phase</th>
                    </tr>
                </thead>
                <tbody>
        """
        for ws in workstreams:
            html += f"""
                    <tr>
                        <td>{ws.name}</td>
                        <td>{ws.workstream_type.value}</td>
                        <td><span class="status-badge status-{ws.status.value.replace('_', '-')}">{ws.status.value}</span></td>
                        <td>{ws.progress_percentage}%</td>
                        <td>{ws.phase.value if ws.phase else 'N/A'}</td>
                    </tr>
            """
        
        html += """
                </tbody>
            </table>
            
            <!-- Synergy Realization -->
            <h1>Synergy Realization</h1>
            <table>
                <thead>
                    <tr>
                        <th>Synergy</th>
                        <th>Category</th>
                        <th>Planned Value</th>
                        <th>Realized Value</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        """
        for syn in synergies:
            html += f"""
                    <tr>
                        <td>{syn.name}</td>
                        <td>{syn.category.value}</td>
                        <td>£{syn.planned_value:,.2f}</td>
                        <td>£{syn.realized_value:,.2f if syn.realized_value else 0}</td>
                        <td>{syn.status.value}</td>
                    </tr>
            """
        
        html += """
                </tbody>
            </table>
            
            <!-- Risk Register -->
            <h1>Risk Register</h1>
            <table>
                <thead>
                    <tr>
                        <th>Risk</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Mitigation</th>
                    </tr>
                </thead>
                <tbody>
        """
        for risk in risks[:10]:  # Top 10 risks
            html += f"""
                    <tr>
                        <td>{risk.title}</td>
                        <td><span class="status-badge severity-{risk.severity.value}">{risk.severity.value}</span></td>
                        <td>{risk.status.value}</td>
                        <td>{risk.mitigation_plan[:100] if risk.mitigation_plan else 'N/A'}...</td>
                    </tr>
            """
        
        html += """
                </tbody>
            </table>
            
            <!-- Day 1 Checklist -->
            <h1>Day 1 Readiness Checklist</h1>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Item</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        """
        for item in checklist_items:
            html += f"""
                    <tr>
                        <td>{item.category.value}</td>
                        <td>{item.item}</td>
                        <td><span class="status-badge status-{item.status.value.replace('_', '-')}">{item.status.value}</span></td>
                    </tr>
            """
        
        html += """
                </tbody>
            </table>
            
            <!-- Next Steps -->
            <h1>Next Steps & Recommendations</h1>
            <p>Based on the current project state, focus on:</p>
            <ul>
                <li>Addressing high-severity risks</li>
                <li>Accelerating workstreams behind schedule</li>
                <li>Realizing quick-win synergies</li>
                <li>Completing Day 1 checklist items</li>
            </ul>
        </body>
        </html>
        """
        return html

    @staticmethod
    def _html_to_pdf(html_content: str) -> bytes:
        """Convert HTML to PDF using WeasyPrint."""
        if not WEASYPRINT_AVAILABLE:
            raise ImportError("weasyprint is not installed")
        
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf()
        return pdf_bytes

    @staticmethod
    async def generate_synergy_report_pdf(
        project_id: str,
        organization_id: str,
        db: Session,
    ) -> Dict[str, Any]:
        """Generate synergy realization report PDF."""
        if not WEASYPRINT_AVAILABLE:
            raise ImportError("weasyprint is not installed")
        
        project = pmi_service.get_pmi_project_by_id(project_id, organization_id, db)
        if not project:
            raise ValueError(f"PMI project {project_id} not found")
        
        synergies = pmi_service.list_synergies(project_id, organization_id, db)
        srr = pmi_service.calculate_synergy_realization_rate(project_id, organization_id, db)
        
        # Generate HTML
        html_content = PMIReportService._generate_synergy_report_html(project, synergies, srr)
        
        # Convert to PDF
        pdf_bytes = PMIReportService._html_to_pdf(html_content)
        
        # Save to storage
        storage_service = get_storage_service()
        file_key = storage_service.generate_file_key(
            organization_id=organization_id,
            deal_id=project.deal_id,
            filename=f"pmi-synergy-report-{project_id}-{datetime.now(timezone.utc).strftime('%Y%m%d')}.pdf",
            user_id=organization_id,
        )
        
        file_stream = io.BytesIO(pdf_bytes)
        await storage_service.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=organization_id,
        )
        
        settings = get_settings()
        api_base_url = getattr(settings, 'api_base_url', None) or "https://ma-saas-backend.onrender.com"
        download_url = f"{api_base_url}/api/pmi/projects/{project_id}/reports/download/{file_key}"
        
        return {
            "file_path": file_key,
            "download_url": download_url,
            "file_size_bytes": len(pdf_bytes),
            "file_type": "application/pdf",
        }

    @staticmethod
    def _generate_synergy_report_html(project, synergies, srr: Decimal) -> str:
        """Generate HTML for synergy report."""
        total_planned = sum(s.planned_value for s in synergies)
        total_realized = sum(s.realized_value or 0 for s in synergies)
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Synergy Realization Report - {project.name}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                h1 {{ color: #1e40af; border-bottom: 2px solid #1e40af; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                th {{ background-color: #f3f4f6; font-weight: bold; }}
            </style>
        </head>
        <body>
            <h1>Synergy Realization Report</h1>
            <p><strong>Project:</strong> {project.name}</p>
            <p><strong>Generated:</strong> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
            
            <h2>Summary Metrics</h2>
            <table>
                <tr><th>Total Planned Value</th><td>£{total_planned:,.2f}</td></tr>
                <tr><th>Total Realized Value</th><td>£{total_realized:,.2f}</td></tr>
                <tr><th>Synergy Realization Rate (SRR)</th><td>{srr:.2f}%</td></tr>
            </table>
            
            <h2>Synergy Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Planned</th>
                        <th>Realized</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        """
        for syn in synergies:
            html += f"""
                    <tr>
                        <td>{syn.name}</td>
                        <td>{syn.category.value}</td>
                        <td>£{syn.planned_value:,.2f}</td>
                        <td>£{syn.realized_value:,.2f if syn.realized_value else 0}</td>
                        <td>{syn.status.value}</td>
                    </tr>
            """
        
        html += """
                </tbody>
            </table>
        </body>
        </html>
        """
        return html

    @staticmethod
    async def generate_risk_report_pdf(
        project_id: str,
        organization_id: str,
        db: Session,
    ) -> Dict[str, Any]:
        """Generate risk assessment report PDF."""
        if not WEASYPRINT_AVAILABLE:
            raise ImportError("weasyprint is not installed")
        
        project = pmi_service.get_pmi_project_by_id(project_id, organization_id, db)
        if not project:
            raise ValueError(f"PMI project {project_id} not found")
        
        risks = pmi_service.list_risks(project_id, organization_id, db)
        
        # Sort by severity
        risks_sorted = sorted(risks, key=lambda r: ['low', 'medium', 'high', 'critical'].index(r.severity.value) if r.severity.value in ['low', 'medium', 'high', 'critical'] else 0, reverse=True)
        
        html_content = PMIReportService._generate_risk_report_html(project, risks_sorted)
        pdf_bytes = PMIReportService._html_to_pdf(html_content)
        
        storage_service = get_storage_service()
        file_key = storage_service.generate_file_key(
            organization_id=organization_id,
            deal_id=project.deal_id,
            filename=f"pmi-risk-report-{project_id}-{datetime.now(timezone.utc).strftime('%Y%m%d')}.pdf",
            user_id=organization_id,
        )
        
        file_stream = io.BytesIO(pdf_bytes)
        await storage_service.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=organization_id,
        )
        
        settings = get_settings()
        api_base_url = getattr(settings, 'api_base_url', None) or "https://ma-saas-backend.onrender.com"
        download_url = f"{api_base_url}/api/pmi/projects/{project_id}/reports/download/{file_key}"
        
        return {
            "file_path": file_key,
            "download_url": download_url,
            "file_size_bytes": len(pdf_bytes),
            "file_type": "application/pdf",
        }

    @staticmethod
    def _generate_risk_report_html(project, risks) -> str:
        """Generate HTML for risk report."""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Risk Assessment Report - {project.name}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                h1 {{ color: #1e40af; border-bottom: 2px solid #1e40af; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                th {{ background-color: #f3f4f6; font-weight: bold; }}
            </style>
        </head>
        <body>
            <h1>Risk Assessment Report</h1>
            <p><strong>Project:</strong> {project.name}</p>
            <p><strong>Generated:</strong> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
            
            <h2>Top 10 Risks by Severity</h2>
            <table>
                <thead>
                    <tr>
                        <th>Risk</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Mitigation Plan</th>
                    </tr>
                </thead>
                <tbody>
        """
        for risk in risks[:10]:
            html += f"""
                    <tr>
                        <td><strong>{risk.title}</strong><br>{risk.description or ''}</td>
                        <td>{risk.severity.value.upper()}</td>
                        <td>{risk.status.value}</td>
                        <td>{risk.mitigation_plan or 'Not specified'}</td>
                    </tr>
            """
        
        html += """
                </tbody>
            </table>
        </body>
        </html>
        """
        return html

    @staticmethod
    async def generate_100day_report_pdf(
        project_id: str,
        organization_id: str,
        db: Session,
    ) -> Dict[str, Any]:
        """Generate 100-day completion report PDF."""
        if not WEASYPRINT_AVAILABLE:
            raise ImportError("weasyprint is not installed")
        
        project = pmi_service.get_pmi_project_by_id(project_id, organization_id, db)
        if not project:
            raise ValueError(f"PMI project {project_id} not found")
        
        dashboard = pmi_service.get_pmi_dashboard(project_id, organization_id, db)
        workstreams = pmi_service.list_workstreams(project_id, organization_id, db)
        synergies = pmi_service.list_synergies(project_id, organization_id, db)
        
        # Generate AI lessons learned
        try:
            lessons = await pmi_ai_service.benchmark_against_industry(project_id, organization_id, db)
            lessons_text = lessons.get("lessons_learned", [])
            if isinstance(lessons_text, list):
                lessons_text = "\n".join([f"- {lesson}" for lesson in lessons_text[:5]])
            else:
                lessons_text = str(lessons_text)
        except Exception:
            lessons_text = "Lessons learned analysis temporarily unavailable."
        
        html_content = PMIReportService._generate_100day_report_html(
            project, dashboard, workstreams, synergies, lessons_text
        )
        pdf_bytes = PMIReportService._html_to_pdf(html_content)
        
        storage_service = get_storage_service()
        file_key = storage_service.generate_file_key(
            organization_id=organization_id,
            deal_id=project.deal_id,
            filename=f"pmi-100day-report-{project_id}-{datetime.now(timezone.utc).strftime('%Y%m%d')}.pdf",
            user_id=organization_id,
        )
        
        file_stream = io.BytesIO(pdf_bytes)
        await storage_service.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=organization_id,
        )
        
        settings = get_settings()
        api_base_url = getattr(settings, 'api_base_url', None) or "https://ma-saas-backend.onrender.com"
        download_url = f"{api_base_url}/api/pmi/projects/{project_id}/reports/download/{file_key}"
        
        return {
            "file_path": file_key,
            "download_url": download_url,
            "file_size_bytes": len(pdf_bytes),
            "file_type": "application/pdf",
        }

    @staticmethod
    def _generate_100day_report_html(project, dashboard, workstreams, synergies, lessons_text: str) -> str:
        """Generate HTML for 100-day completion report."""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>100-Day Completion Report - {project.name}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                h1 {{ color: #1e40af; border-bottom: 2px solid #1e40af; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                th {{ background-color: #f3f4f6; font-weight: bold; }}
            </style>
        </head>
        <body>
            <h1>100-Day PMI Completion Report</h1>
            <p><strong>Project:</strong> {project.name}</p>
            <p><strong>Generated:</strong> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
            
            <h2>Project Completion Summary</h2>
            <p>Status: {project.status.value}</p>
            <p>Final Synergy Realization Rate: {dashboard.synergy_realization_rate:.2f}%</p>
            
            <h2>Workstream Achievements</h2>
            <table>
                <thead>
                    <tr>
                        <th>Workstream</th>
                        <th>Final Status</th>
                        <th>Completion</th>
                    </tr>
                </thead>
                <tbody>
        """
        for ws in workstreams:
            html += f"""
                    <tr>
                        <td>{ws.name}</td>
                        <td>{ws.status.value}</td>
                        <td>{ws.progress_percentage}%</td>
                    </tr>
            """
        
        html += f"""
                </tbody>
            </table>
            
            <h2>Final Synergy Realization</h2>
            <p>Total Planned: £{sum(s.planned_value for s in synergies):,.2f}</p>
            <p>Total Realized: £{sum(s.realized_value or 0 for s in synergies):,.2f}</p>
            
            <h2>Lessons Learned</h2>
            <p>{lessons_text}</p>
        </body>
        </html>
        """
        return html

