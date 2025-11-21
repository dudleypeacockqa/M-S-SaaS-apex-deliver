"""
Valuation Export Service
Feature: DEV-011 Phase 5 - Valuation Suite Exports (PDF/Excel)

This service handles exporting valuations to PDF and Excel formats.
"""

import io
import os
import uuid
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime, UTC
from decimal import Decimal

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    pd = None  # type: ignore
    PANDAS_AVAILABLE = False

try:
    from weasyprint import HTML, CSS
    from weasyprint.text.fonts import FontConfiguration
    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError):
    # OSError can occur if system libraries (libgobject, libpango, etc.) are missing
    HTML = None  # type: ignore
    CSS = None  # type: ignore
    FontConfiguration = None  # type: ignore
    WEASYPRINT_AVAILABLE = False

try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
    from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False
    # Define stubs for type hints when not available
    letter = None  # type: ignore
    A4 = None  # type: ignore
    getSampleStyleSheet = None  # type: ignore
    ParagraphStyle = None  # type: ignore
    inch = None  # type: ignore
    SimpleDocTemplate = None  # type: ignore
    Paragraph = None  # type: ignore
    Spacer = None  # type: ignore
    PageBreak = None  # type: ignore
    Table = None  # type: ignore
    TableStyle = None  # type: ignore
    TA_LEFT = None  # type: ignore
    TA_CENTER = None  # type: ignore
    TA_RIGHT = None  # type: ignore
    colors = None  # type: ignore

from app.models.document import Document
from app.services.valuation_service import get_valuation, list_comparable_companies, list_precedent_transactions, list_scenarios
from app.services.storage_service import get_storage_service
from app.core.config import get_settings


class ValuationExportService:
    """Service for exporting valuations to PDF and Excel formats."""

    @staticmethod
    async def export_to_pdf(
        db,
        valuation_id: str,
        organization_id: str,
        export_format: Optional[str] = None,
        scenario_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Export valuation to PDF format.

        Args:
            db: Database session
            valuation_id: Valuation UUID
            organization_id: Organization UUID
            export_format: Export format ('summary', 'detailed', 'scenario')
            scenario_id: Optional scenario ID for scenario-specific export

        Returns:
            Dictionary with file_path, download_url, and file_size_bytes

        Raises:
            ValueError: If valuation not found
            ImportError: If PDF generation libraries not installed
        """
        # Get valuation data
        valuation = get_valuation(db=db, valuation_id=valuation_id, organization_id=organization_id)
        if not valuation:
            raise ValueError("Valuation not found")

        # Get related data
        comparables = list_comparable_companies(db=db, valuation_id=valuation_id, organization_id=organization_id)
        precedents = list_precedent_transactions(db=db, valuation_id=valuation_id, organization_id=organization_id)
        scenarios_list = list_scenarios(db=db, valuation_id=valuation_id, organization_id=organization_id)

        # Generate HTML content
        html_content = ValuationExportService._generate_html_content(
            valuation=valuation,
            comparables=comparables,
            precedents=precedents,
            scenarios=scenarios_list,
            export_format=export_format,
            scenario_id=scenario_id,
        )

        # Convert HTML to PDF using weasyprint (preferred) or reportlab
        if WEASYPRINT_AVAILABLE:
            pdf_bytes = ValuationExportService._html_to_pdf_weasyprint(html_content)
        elif REPORTLAB_AVAILABLE:
            pdf_bytes = ValuationExportService._generate_pdf_reportlab(
                valuation=valuation,
                comparables=comparables,
                precedents=precedents,
                scenarios=scenarios_list,
            )
        else:
            raise ImportError("PDF generation libraries not installed. Install weasyprint or reportlab.")

        # Save to storage
        storage_service = get_storage_service()
        file_key = storage_service.generate_file_key(
            organization_id=organization_id,
            deal_id=valuation.deal_id,
            filename=f"valuation-{valuation_id}.pdf",
            user_id=organization_id,
        )

        # Save file
        file_stream = io.BytesIO(pdf_bytes)
        file_path = await storage_service.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=organization_id,
        )

        # Construct download URL
        settings = get_settings()
        api_base_url = getattr(settings, 'api_base_url', None) or "https://ma-saas-backend.onrender.com"
        download_url = f"{api_base_url}/api/deals/{valuation.deal_id}/valuations/{valuation_id}/exports/download/{file_key}"

        return {
            "file_path": file_key,
            "download_url": download_url,
            "file_size_bytes": len(pdf_bytes),
            "file_type": "application/pdf",
        }

    @staticmethod
    async def export_to_excel(
        db,
        valuation_id: str,
        organization_id: str,
        export_format: Optional[str] = None,
        scenario_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Export valuation to Excel format.

        Args:
            db: Database session
            valuation_id: Valuation UUID
            organization_id: Organization UUID
            export_format: Export format ('summary', 'detailed', 'scenario')
            scenario_id: Optional scenario ID for scenario-specific export

        Returns:
            Dictionary with file_path, download_url, and file_size_bytes

        Raises:
            ValueError: If valuation not found
            ImportError: If Excel generation libraries not installed
        """
        if not PANDAS_AVAILABLE:
            raise ImportError("pandas and openpyxl are not installed. Install them with: pip install pandas openpyxl")

        # Get valuation data
        valuation = get_valuation(db=db, valuation_id=valuation_id, organization_id=organization_id)
        if not valuation:
            raise ValueError("Valuation not found")

        # Get related data
        comparables = list_comparable_companies(db=db, valuation_id=valuation_id, organization_id=organization_id)
        precedents = list_precedent_transactions(db=db, valuation_id=valuation_id, organization_id=organization_id)
        scenarios_list = list_scenarios(db=db, valuation_id=valuation_id, organization_id=organization_id)

        # Create Excel workbook
        excel_buffer = io.BytesIO()
        with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
            # Summary sheet
            summary_data = {
                'Metric': [
                    'Enterprise Value',
                    'Equity Value',
                    'Net Debt',
                    'Shares Outstanding',
                    'Implied Share Price',
                    'Discount Rate',
                    'Terminal Growth Rate',
                    'Forecast Years',
                ],
                'Value': [
                    float(valuation.enterprise_value),
                    float(valuation.equity_value),
                    float(valuation.net_debt),
                    valuation.shares_outstanding,
                    float(valuation.equity_value) / float(valuation.shares_outstanding) if valuation.shares_outstanding else 0,
                    float(valuation.discount_rate),
                    float(valuation.terminal_growth_rate),
                    valuation.forecast_years,
                ],
            }
            df_summary = pd.DataFrame(summary_data)
            df_summary.to_excel(writer, sheet_name='Summary', index=False)

            # Cash flows sheet
            if valuation.cash_flows:
                df_cash_flows = pd.DataFrame({
                    'Year': range(1, len(valuation.cash_flows) + 1),
                    'Cash Flow': [float(cf) for cf in valuation.cash_flows],
                })
                df_cash_flows.to_excel(writer, sheet_name='Cash Flows', index=False)

            # Comparables sheet
            if comparables:
                comparables_data = []
                for comp in comparables:
                    comparables_data.append({
                        'Company Name': comp.company_name,
                        'EV/Revenue': float(comp.ev_revenue) if comp.ev_revenue else None,
                        'EV/EBITDA': float(comp.ev_ebitda) if comp.ev_ebitda else None,
                        'P/E': float(comp.pe_ratio) if comp.pe_ratio else None,
                        'Weight': float(comp.weight) if comp.weight else None,
                    })
                df_comparables = pd.DataFrame(comparables_data)
                df_comparables.to_excel(writer, sheet_name='Comparables', index=False)

            # Precedents sheet
            if precedents:
                precedents_data = []
                for prec in precedents:
                    precedents_data.append({
                        'Target': prec.target_company,
                        'Acquirer': prec.acquirer_company,
                        'EV/EBITDA': float(prec.ev_ebitda) if prec.ev_ebitda else None,
                        'Transaction Date': prec.transaction_date.isoformat() if prec.transaction_date else None,
                        'Weight': float(prec.weight) if prec.weight else None,
                    })
                df_precedents = pd.DataFrame(precedents_data)
                df_precedents.to_excel(writer, sheet_name='Precedents', index=False)

            # Scenarios sheet
            if scenarios_list:
                scenarios_data = []
                for scenario in scenarios_list:
                    scenarios_data.append({
                        'Name': scenario.name,
                        'Description': scenario.description or '',
                        'Enterprise Value': float(scenario.enterprise_value) if scenario.enterprise_value else None,
                        'Equity Value': float(scenario.equity_value) if scenario.equity_value else None,
                    })
                df_scenarios = pd.DataFrame(scenarios_data)
                df_scenarios.to_excel(writer, sheet_name='Scenarios', index=False)

        excel_buffer.seek(0)
        excel_bytes = excel_buffer.read()

        # Save to storage
        storage_service = get_storage_service()
        file_key = storage_service.generate_file_key(
            organization_id=organization_id,
            deal_id=valuation.deal_id,
            filename=f"valuation-{valuation_id}.xlsx",
            user_id=organization_id,
        )

        # Save file
        file_stream = io.BytesIO(excel_bytes)
        file_path = await storage_service.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=organization_id,
        )

        # Construct download URL
        settings = get_settings()
        api_base_url = getattr(settings, 'api_base_url', None) or "https://ma-saas-backend.onrender.com"
        download_url = f"{api_base_url}/api/deals/{valuation.deal_id}/valuations/{valuation_id}/exports/download/{file_key}"

        return {
            "file_path": file_key,
            "download_url": download_url,
            "file_size_bytes": len(excel_bytes),
            "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }

    @staticmethod
    def _generate_html_content(
        valuation,
        comparables,
        precedents,
        scenarios,
        export_format: Optional[str] = None,
        scenario_id: Optional[str] = None,
    ) -> str:
        """Generate HTML content for PDF export."""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Valuation Report - {valuation.id}</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #333;
                }}
                h1 {{
                    color: #1e40af;
                    border-bottom: 2px solid #1e40af;
                    padding-bottom: 10px;
                }}
                h2 {{
                    color: #3b82f6;
                    margin-top: 30px;
                }}
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }}
                th {{
                    background-color: #f3f4f6;
                    font-weight: bold;
                }}
                .metric {{
                    font-weight: bold;
                    color: #1e40af;
                }}
            </style>
        </head>
        <body>
            <h1>Valuation Report</h1>
            <p><strong>Valuation ID:</strong> {valuation.id}</p>
            <p><strong>Generated:</strong> {datetime.now(UTC).strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
            
            <h2>Summary</h2>
            <table>
                <tr>
                    <td class="metric">Enterprise Value</td>
                    <td>${valuation.enterprise_value:,.2f}</td>
                </tr>
                <tr>
                    <td class="metric">Equity Value</td>
                    <td>${valuation.equity_value:,.2f}</td>
                </tr>
                <tr>
                    <td class="metric">Net Debt</td>
                    <td>${valuation.net_debt:,.2f}</td>
                </tr>
                <tr>
                    <td class="metric">Shares Outstanding</td>
                    <td>{valuation.shares_outstanding:,}</td>
                </tr>
                <tr>
                    <td class="metric">Implied Share Price</td>
                    <td>${float(valuation.equity_value) / float(valuation.shares_outstanding):,.2f}</td>
                </tr>
                <tr>
                    <td class="metric">Discount Rate</td>
                    <td>{float(valuation.discount_rate) * 100:.2f}%</td>
                </tr>
                <tr>
                    <td class="metric">Terminal Growth Rate</td>
                    <td>{float(valuation.terminal_growth_rate) * 100:.2f}%</td>
                </tr>
                <tr>
                    <td class="metric">Forecast Years</td>
                    <td>{valuation.forecast_years}</td>
                </tr>
            </table>
        </body>
        </html>
        """
        return html

    @staticmethod
    def _html_to_pdf_weasyprint(html_content: str) -> bytes:
        """Convert HTML to PDF using weasyprint."""
        if not WEASYPRINT_AVAILABLE:
            raise ImportError("weasyprint is not installed")

        from importlib import import_module

        try:
            weasyprint_module = import_module("weasyprint")
        except Exception as exc:
            raise ImportError("weasyprint is not installed") from exc

        html_cls = getattr(weasyprint_module, "HTML")
        html = html_cls(string=html_content)
        pdf_bytes = html.write_pdf()
        return pdf_bytes

    @staticmethod
    def _generate_pdf_reportlab(
        valuation,
        comparables,
        precedents,
        scenarios,
    ) -> bytes:
        """Generate PDF using reportlab (fallback if weasyprint not available)."""
        if not REPORTLAB_AVAILABLE:
            raise ImportError("reportlab is not installed")
        
        # Import here to ensure availability (in case REPORTLAB_AVAILABLE was set incorrectly)
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.enums import TA_CENTER
        from reportlab.lib import colors
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []

        # Title
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "CustomTitle",
            parent=styles["Heading1"],
            fontSize=18,
            textColor="black",
            spaceAfter=30,
            alignment=TA_CENTER,
        )
        story.append(Paragraph("Valuation Report", title_style))
        story.append(Spacer(1, 12))

        # Summary table
        summary_data = [
            ["Metric", "Value"],
            ["Enterprise Value", f"${valuation.enterprise_value:,.2f}"],
            ["Equity Value", f"${valuation.equity_value:,.2f}"],
            ["Net Debt", f"${valuation.net_debt:,.2f}"],
            ["Shares Outstanding", f"{valuation.shares_outstanding:,}"],
            ["Discount Rate", f"{float(valuation.discount_rate) * 100:.2f}%"],
            ["Terminal Growth Rate", f"{float(valuation.terminal_growth_rate) * 100:.2f}%"],
        ]
        summary_table = Table(summary_data)
        summary_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 14),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ]))
        story.append(summary_table)

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.read()

    @staticmethod
    @staticmethod
    def _register_document_room_entry(
        *,
        db,
        export_log,
        export_result: Dict[str, Any],
    ) -> Optional[Document]:
        """Persist valuation exports into the document room once complete."""

        if export_log.document_id:
            return None

        file_key = export_result.get('file_path')
        if not file_key:
            return None

        valuation = get_valuation(
            db=db,
            valuation_id=export_log.valuation_id,
            organization_id=export_log.organization_id,
        )
        if not valuation:
            return None

        uploader_id = export_log.exported_by or valuation.created_by
        if not uploader_id:
            return None

        ext = 'pdf' if export_log.export_type == 'pdf' else 'xlsx'
        timestamp = datetime.now(UTC).strftime('%Y%m%d-%H%M%S')
        document_name = f"Valuation Export - {valuation.id}-{timestamp}.{ext}"

        document = Document(
            id=str(uuid.uuid4()),
            name=document_name,
            file_key=file_key,
            file_size=export_result.get('file_size_bytes') or 0,
            file_type=export_result.get('file_type') or (
                'application/pdf'
                if export_log.export_type == 'pdf'
                else 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ),
            deal_id=str(valuation.deal_id),
            folder_id=None,
            organization_id=export_log.organization_id,
            uploaded_by=uploader_id,
            version=1,
            parent_document_id=None,
        )
        document.created_at = datetime.now(UTC)
        db.add(document)
        db.commit()
        db.refresh(document)

        export_log.document_id = document.id
        db.add(export_log)
        db.commit()

        return document

    @staticmethod
    async def process_export_task(
        export_log_id: str,
        db,
    ) -> Dict[str, Any]:
        """
        Process an export task asynchronously.

        Args:
            export_log_id: Export log UUID
            db: Database session

        Returns:
            Dictionary with export results
        """
        from app.models.valuation import ValuationExportLog
        
        export_log = db.get(ValuationExportLog, export_log_id)
        if not export_log:
            raise ValueError("Export log not found")

        try:
            # Update status to processing
            export_log.status = 'processing'
            db.add(export_log)
            db.commit()

            # Generate export based on type
            if export_log.export_type == 'pdf':
                result = await ValuationExportService.export_to_pdf(
                    db=db,
                    valuation_id=export_log.valuation_id,
                    organization_id=export_log.organization_id,
                    export_format=export_log.export_format,
                    scenario_id=export_log.scenario_id,
                )
            elif export_log.export_type == 'excel':
                result = await ValuationExportService.export_to_excel(
                    db=db,
                    valuation_id=export_log.valuation_id,
                    organization_id=export_log.organization_id,
                    export_format=export_log.export_format,
                    scenario_id=export_log.scenario_id,
                )
            else:
                raise ValueError(f"Unsupported export type: {export_log.export_type}")

            # Update export log with results
            export_log.status = 'completed'
            export_log.download_url = result.get('download_url')
            export_log.file_size_bytes = result.get('file_size_bytes')
            export_log.completed_at = datetime.now(UTC)
            db.add(export_log)
            db.commit()
            db.refresh(export_log)

            ValuationExportService._register_document_room_entry(
                db=db,
                export_log=export_log,
                export_result=result,
            )

            return result

        except Exception as e:
            # Update export log with error
            export_log.status = 'failed'
            export_log.error_message = str(e)
            db.add(export_log)
            db.commit()
            raise

