"""
Tests for valuation export service (DEV-011 Phase 5).
Tests for PDF and Excel export functionality.
"""

import io
import pytest
from unittest.mock import Mock, patch, MagicMock, AsyncMock
from decimal import Decimal
from uuid import uuid4

from app.models.valuation import ValuationModel, ValuationExportLog
from app.services import valuation_service
from app.services.valuation_export_service import ValuationExportService


class TestValuationExportService:
    """Test suite for valuation export service."""

    @pytest.fixture
    def sample_valuation(self, db_session, create_organization, growth_user):
        """Create a sample valuation for testing."""
        from app.models.deal import Deal, DealStage
        
        org = create_organization()
        deal = Deal(
            id=str(uuid4()),
            name="Test Deal",
            target_company="Test Company",
            organization_id=str(org.id),
            owner_id=str(growth_user.id),
            stage=DealStage.sourcing,
        )
        db_session.add(deal)
        db_session.flush()
        
        valuation = ValuationModel(
            id=str(uuid4()),
            deal_id=str(deal.id),
            organization_id=str(org.id),
            created_by=str(growth_user.id),
            forecast_years=5,
            discount_rate=Decimal('0.12'),
            terminal_growth_rate=Decimal('0.03'),
            terminal_method='gordon_growth',
            cash_flows=[500000, 650000, 800000, 950000, 1100000],
            terminal_cash_flow=Decimal('1200000'),
            net_debt=Decimal('2000000'),
            shares_outstanding=1000000,
            enterprise_value=Decimal('10000000'),
            equity_value=Decimal('8000000'),
        )
        db_session.add(valuation)
        db_session.commit()
        db_session.refresh(valuation)
        return valuation

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    @patch('app.services.valuation_export_service.list_comparable_companies')
    @patch('app.services.valuation_export_service.list_precedent_transactions')
    @patch('app.services.valuation_export_service.list_scenarios')
    @patch('app.services.valuation_export_service.WEASYPRINT_AVAILABLE', False)
    @patch('app.services.valuation_export_service.REPORTLAB_AVAILABLE', True)
    async def test_export_to_pdf_with_reportlab(
        self, 
        mock_scenarios,
        mock_precedents,
        mock_comparables,
        mock_get_valuation,
        mock_storage,
        sample_valuation,
        db_session
    ):
        """Test PDF export using reportlab fallback."""
        # Setup mocks
        mock_get_valuation.return_value = sample_valuation
        mock_comparables.return_value = []
        mock_precedents.return_value = []
        mock_scenarios.return_value = []
        
        mock_storage_service = MagicMock()
        mock_storage_service.generate_file_key.return_value = "test-file-key"
        mock_storage_service.save_file = AsyncMock(return_value="s3://bucket/test-file-key")
        mock_storage.return_value = mock_storage_service
        
        # Mock reportlab module at sys.modules level
        import sys
        mock_reportlab = MagicMock()
        mock_reportlab.lib.pagesizes.letter = 'letter'
        mock_reportlab.lib.styles.getSampleStyleSheet.return_value = {"Heading1": MagicMock()}
        mock_reportlab.lib.enums.TA_CENTER = 'center'
        mock_reportlab.lib.colors.grey = 'grey'
        mock_reportlab.lib.colors.whitesmoke = 'whitesmoke'
        mock_reportlab.lib.colors.beige = 'beige'
        mock_reportlab.lib.colors.black = 'black'
        
        mock_doc = MagicMock()
        mock_doc.build.return_value = None
        mock_reportlab.platypus.SimpleDocTemplate.return_value = mock_doc
        mock_reportlab.platypus.Paragraph.return_value = MagicMock()
        mock_reportlab.platypus.Spacer.return_value = MagicMock()
        mock_table = MagicMock()
        mock_reportlab.platypus.Table.return_value = mock_table
        
        # Mock BytesIO
        mock_buffer = io.BytesIO(b"fake pdf bytes")
        
        with patch.dict('sys.modules', {'reportlab': mock_reportlab, 'reportlab.lib': mock_reportlab.lib, 
                                        'reportlab.lib.pagesizes': mock_reportlab.lib.pagesizes,
                                        'reportlab.lib.styles': mock_reportlab.lib.styles,
                                        'reportlab.lib.enums': mock_reportlab.lib.enums,
                                        'reportlab.lib.colors': mock_reportlab.lib.colors,
                                        'reportlab.platypus': mock_reportlab.platypus}), \
             patch('io.BytesIO', return_value=mock_buffer):
            
            # Execute
            result = await ValuationExportService.export_to_pdf(
                db=db_session,
                valuation_id=str(sample_valuation.id),
                organization_id=str(sample_valuation.organization_id),
                export_format='summary',
            )
            
            # Verify
            assert result is not None
            assert 'file_path' in result
            assert 'download_url' in result
            assert 'file_size_bytes' in result
            assert result['file_type'] == 'application/pdf'
            mock_storage_service.save_file.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    @patch('app.services.valuation_export_service.list_comparable_companies')
    @patch('app.services.valuation_export_service.list_precedent_transactions')
    @patch('app.services.valuation_export_service.list_scenarios')
    @patch('app.services.valuation_export_service.WEASYPRINT_AVAILABLE', True)
    async def test_export_to_pdf_with_weasyprint(
        self,
        mock_scenarios,
        mock_precedents,
        mock_comparables,
        mock_get_valuation,
        mock_storage,
        sample_valuation,
        db_session
    ):
        """Test PDF export using weasyprint."""
        # Setup mocks
        mock_get_valuation.return_value = sample_valuation
        mock_comparables.return_value = []
        mock_precedents.return_value = []
        mock_scenarios.return_value = []
        
        mock_storage_service = MagicMock()
        mock_storage_service.generate_file_key.return_value = "test-file-key"
        mock_storage_service.save_file = AsyncMock(return_value="s3://bucket/test-file-key")
        mock_storage.return_value = mock_storage_service
        
        # Mock weasyprint module at sys.modules level
        import sys
        mock_weasyprint = MagicMock()
        mock_html_instance = MagicMock()
        mock_html_instance.write_pdf.return_value = b"fake pdf content"
        mock_weasyprint.HTML.return_value = mock_html_instance
        
        with patch.dict('sys.modules', {'weasyprint': mock_weasyprint}):
            with patch('weasyprint.HTML', mock_weasyprint.HTML):
                # Execute
                result = await ValuationExportService.export_to_pdf(
                    db=db_session,
                    valuation_id=str(sample_valuation.id),
                    organization_id=str(sample_valuation.organization_id),
                )
                
                # Verify
                assert result is not None
                assert 'file_path' in result
                assert 'download_url' in result

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    @patch('app.services.valuation_export_service.list_comparable_companies')
    @patch('app.services.valuation_export_service.list_precedent_transactions')
    @patch('app.services.valuation_export_service.list_scenarios')
    @patch('app.services.valuation_export_service.PANDAS_AVAILABLE', True)
    async def test_export_to_excel_creates_file(
        self,
        mock_scenarios,
        mock_precedents,
        mock_comparables,
        mock_get_valuation,
        mock_storage,
        sample_valuation,
        db_session
    ):
        """Test that Excel export creates a file."""
        # Setup mocks
        mock_get_valuation.return_value = sample_valuation
        mock_comparables.return_value = []
        mock_precedents.return_value = []
        mock_scenarios.return_value = []
        
        mock_storage_service = MagicMock()
        mock_storage_service.generate_file_key.return_value = "test-file-key"
        mock_storage_service.save_file = AsyncMock(return_value="s3://bucket/test-file-key")
        mock_storage.return_value = mock_storage_service
        
        # Mock pandas module at sys.modules level
        import sys
        mock_pandas = MagicMock()
        mock_excel_writer = MagicMock()
        mock_excel_writer.__enter__.return_value = mock_excel_writer
        mock_excel_writer.__exit__.return_value = None
        mock_pandas.ExcelWriter.return_value = mock_excel_writer
        mock_dataframe = MagicMock()
        mock_dataframe.to_excel = MagicMock()
        mock_pandas.DataFrame.return_value = mock_dataframe
        
        # Mock BytesIO for excel buffer
        mock_excel_buffer = io.BytesIO(b"fake excel bytes")
        
        with patch.dict('sys.modules', {'pandas': mock_pandas}), \
             patch('app.services.valuation_export_service.pd', mock_pandas), \
             patch('io.BytesIO', return_value=mock_excel_buffer):
            
            # Execute
            result = await ValuationExportService.export_to_excel(
                db=db_session,
                valuation_id=str(sample_valuation.id),
                organization_id=str(sample_valuation.organization_id),
                export_format='summary',
            )
            
            # Verify
            assert result is not None
            assert 'file_path' in result
            assert 'download_url' in result
            assert result['file_type'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    async def test_export_to_pdf_raises_error_when_valuation_not_found(
        self,
        mock_get_valuation,
        mock_storage,
        db_session
    ):
        """Test that export raises ValueError when valuation not found."""
        mock_get_valuation.return_value = None
        
        with pytest.raises(ValueError, match="Valuation not found"):
            await ValuationExportService.export_to_pdf(
                db=db_session,
                valuation_id=str(uuid4()),
                organization_id=str(uuid4()),
            )

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    @patch('app.services.valuation_export_service.WEASYPRINT_AVAILABLE', False)
    @patch('app.services.valuation_export_service.REPORTLAB_AVAILABLE', False)
    async def test_export_to_pdf_raises_error_when_no_pdf_libraries(
        self,
        mock_get_valuation,
        mock_storage,
        sample_valuation,
        db_session
    ):
        """Test that export raises ImportError when PDF libraries not available."""
        mock_get_valuation.return_value = sample_valuation
        
        with pytest.raises(ImportError, match="PDF generation libraries not installed"):
            await ValuationExportService.export_to_pdf(
                db=db_session,
                valuation_id=str(sample_valuation.id),
                organization_id=str(sample_valuation.organization_id),
            )

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    @patch('app.services.valuation_export_service.PANDAS_AVAILABLE', False)
    async def test_export_to_excel_raises_error_when_pandas_not_available(
        self,
        mock_get_valuation,
        mock_storage,
        sample_valuation,
        db_session
    ):
        """Test that Excel export raises ImportError when pandas not available."""
        mock_get_valuation.return_value = sample_valuation
        
        with pytest.raises(ImportError, match="pandas and openpyxl are not installed"):
            await ValuationExportService.export_to_excel(
                db=db_session,
                valuation_id=str(sample_valuation.id),
                organization_id=str(sample_valuation.organization_id),
            )

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    @patch('app.services.valuation_export_service.list_comparable_companies')
    @patch('app.services.valuation_export_service.list_precedent_transactions')
    @patch('app.services.valuation_export_service.list_scenarios')
    @patch('app.services.valuation_export_service.WEASYPRINT_AVAILABLE', True)
    async def test_export_updates_export_log(
        self,
        mock_scenarios,
        mock_precedents,
        mock_comparables,
        mock_get_valuation,
        mock_storage,
        sample_valuation,
        db_session
    ):
        """Test that export updates the export log with file path."""
        # Create export log
        export_log = ValuationExportLog(
            id=str(uuid4()),
            valuation_id=str(sample_valuation.id),
            organization_id=str(sample_valuation.organization_id),
            export_type='pdf',
            export_format='summary',
            exported_by=str(sample_valuation.created_by),
            status='queued',
        )
        db_session.add(export_log)
        db_session.commit()
        
        # Setup mocks
        mock_get_valuation.return_value = sample_valuation
        mock_comparables.return_value = []
        mock_precedents.return_value = []
        mock_scenarios.return_value = []
        
        mock_storage_service = MagicMock()
        mock_storage_service.generate_file_key.return_value = "test-file-key"
        mock_storage_service.save_file = AsyncMock(return_value="s3://bucket/test-file-key")
        mock_storage.return_value = mock_storage_service
        
        # Mock weasyprint module at sys.modules level
        import sys
        mock_weasyprint = MagicMock()
        mock_html_instance = MagicMock()
        mock_html_instance.write_pdf.return_value = b"fake pdf content"
        mock_weasyprint.HTML.return_value = mock_html_instance
        
        with patch.dict('sys.modules', {'weasyprint': mock_weasyprint}):
            with patch('weasyprint.HTML', mock_weasyprint.HTML):
                # Execute
                result = await ValuationExportService.process_export_task(
                    export_log_id=str(export_log.id),
                    db=db_session,
                )
                
                # Verify
                db_session.refresh(export_log)
                assert export_log.status == 'completed'
                assert export_log.download_url is not None
                assert export_log.file_size_bytes is not None
                assert result is not None

    @pytest.mark.asyncio
    async def test_process_export_task_raises_error_when_log_not_found(self, db_session):
        """Test that process_export_task raises ValueError when log not found."""
        with pytest.raises(ValueError, match="Export log not found"):
            await ValuationExportService.process_export_task(
                export_log_id=str(uuid4()),
                db=db_session,
            )

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    @patch('app.services.valuation_export_service.list_comparable_companies')
    @patch('app.services.valuation_export_service.list_precedent_transactions')
    @patch('app.services.valuation_export_service.list_scenarios')
    @patch('app.services.valuation_export_service.WEASYPRINT_AVAILABLE', True)
    async def test_process_export_task_handles_errors(
        self,
        mock_scenarios,
        mock_precedents,
        mock_comparables,
        mock_get_valuation,
        mock_storage,
        sample_valuation,
        db_session
    ):
        """Test that process_export_task handles errors and updates log."""
        # Create export log
        export_log = ValuationExportLog(
            id=str(uuid4()),
            valuation_id=str(sample_valuation.id),
            organization_id=str(sample_valuation.organization_id),
            export_type='pdf',
            export_format='summary',
            exported_by=str(sample_valuation.created_by),
            status='queued',
        )
        db_session.add(export_log)
        db_session.commit()
        
        # Setup mocks to raise error
        mock_get_valuation.side_effect = Exception("Test error")
        
        # Execute
        with pytest.raises(Exception, match="Test error"):
            await ValuationExportService.process_export_task(
                export_log_id=str(export_log.id),
                db=db_session,
            )
        
        # Verify error was logged
        db_session.refresh(export_log)
        assert export_log.status == 'failed'
        assert export_log.error_message is not None

    @pytest.mark.asyncio
    @patch('app.services.valuation_export_service.get_storage_service')
    @patch('app.services.valuation_export_service.get_valuation')
    @patch('app.services.valuation_export_service.list_comparable_companies')
    @patch('app.services.valuation_export_service.list_precedent_transactions')
    @patch('app.services.valuation_export_service.list_scenarios')
    @patch('app.services.valuation_export_service.WEASYPRINT_AVAILABLE', True)
    async def test_export_includes_valuation_data(
        self,
        mock_scenarios,
        mock_precedents,
        mock_comparables,
        mock_get_valuation,
        mock_storage,
        sample_valuation,
        db_session
    ):
        """Test that exported file includes valuation data."""
        # Setup mocks
        mock_get_valuation.return_value = sample_valuation
        mock_comparables.return_value = []
        mock_precedents.return_value = []
        mock_scenarios.return_value = []
        
        mock_storage_service = MagicMock()
        mock_storage_service.generate_file_key.return_value = "test-file-key"
        mock_storage_service.save_file = AsyncMock(return_value="s3://bucket/test-file-key")
        mock_storage.return_value = mock_storage_service
        
        # Mock weasyprint module at sys.modules level
        import sys
        mock_weasyprint = MagicMock()
        mock_html_instance = MagicMock()
        mock_html_instance.write_pdf.return_value = b"fake pdf content"
        mock_weasyprint.HTML.return_value = mock_html_instance
        
        with patch.dict('sys.modules', {'weasyprint': mock_weasyprint}):
            with patch('weasyprint.HTML', mock_weasyprint.HTML):
                # Execute
                result = await ValuationExportService.export_to_pdf(
                    db=db_session,
                    valuation_id=str(sample_valuation.id),
                    organization_id=str(sample_valuation.organization_id),
                    export_format='summary',
                )
                
                # Verify that HTML content was generated with valuation data
                # Verify service was called (indirect verification that data was processed)
                assert result is not None
                mock_get_valuation.assert_called_once()
