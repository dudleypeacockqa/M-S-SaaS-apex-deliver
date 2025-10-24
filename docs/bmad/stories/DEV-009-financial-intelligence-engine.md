# DEV-009: Financial Intelligence Engine

**Story ID**: DEV-009
**Sprint**: Sprint 3
**Priority**: HIGH (Phase 1 - Foundational Core)
**Estimated Effort**: 16-20 hours
**Methodology**: BMAD v6-alpha + TDD

---

## 🎯 Story Objective

Build a comprehensive Financial Intelligence Engine that integrates with major accounting platforms (Xero, QuickBooks), imports financial data, calculates 47+ financial ratios, generates AI-powered narratives, and provides a Deal Readiness Score to help M&A professionals quickly assess target companies.

**Business Value**: This is the core differentiation feature that sets our platform apart from basic deal management tools. Financial intelligence transforms the platform from a workflow tool into an analytical powerhouse.

---

## 📋 Acceptance Criteria

### Must Have (Sprint 3)

#### 1. Accounting Platform Integration
- [ ] **Xero Integration**:
  - OAuth 2.0 authentication flow
  - Import Balance Sheet, P&L, Cash Flow Statement
  - Securely store connection tokens
  - Refresh token handling
  - Error handling for expired/revoked access

- [ ] **QuickBooks Integration**:
  - OAuth 2.0 authentication flow
  - Import Balance Sheet, P&L, Cash Flow Statement
  - Securely store connection tokens
  - Refresh token handling
  - Error handling for expired/revoked access

#### 2. Financial Data Management
- [ ] **Database Schema**:
  - `financial_connections` table (store OAuth tokens, connection metadata)
  - `financial_statements` table (store imported data by period)
  - `financial_ratios` table (store calculated ratios)
  - `financial_narratives` table (store AI-generated analysis)

- [ ] **Data Import**:
  - Manual refresh button (batch import)
  - Import last 12 months of financial data
  - Data normalization across platforms
  - Historical data storage with versions

#### 3. Ratio Calculation Engine (47 Ratios)

**Liquidity Ratios** (5):
- [ ] Current Ratio = Current Assets / Current Liabilities
- [ ] Quick Ratio = (Current Assets - Inventory) / Current Liabilities
- [ ] Cash Ratio = Cash & Equivalents / Current Liabilities
- [ ] Operating Cash Flow Ratio = Operating Cash Flow / Current Liabilities
- [ ] Defensive Interval Ratio = (Cash + Marketable Securities + Receivables) / Daily Operating Expenses

**Profitability Ratios** (8):
- [ ] Gross Profit Margin = (Revenue - COGS) / Revenue
- [ ] Operating Profit Margin = Operating Income / Revenue
- [ ] Net Profit Margin = Net Income / Revenue
- [ ] Return on Assets (ROA) = Net Income / Total Assets
- [ ] Return on Equity (ROE) = Net Income / Shareholders' Equity
- [ ] Return on Invested Capital (ROIC) = NOPAT / Invested Capital
- [ ] EBITDA Margin = EBITDA / Revenue
- [ ] EBIT Margin = EBIT / Revenue

**Leverage Ratios** (6):
- [ ] Debt-to-Equity = Total Debt / Total Equity
- [ ] Debt-to-Assets = Total Debt / Total Assets
- [ ] Equity Multiplier = Total Assets / Total Equity
- [ ] Interest Coverage = EBIT / Interest Expense
- [ ] Debt Service Coverage = Operating Income / Total Debt Service
- [ ] Financial Leverage = Total Assets / Equity

**Efficiency Ratios** (7):
- [ ] Asset Turnover = Revenue / Average Total Assets
- [ ] Inventory Turnover = COGS / Average Inventory
- [ ] Receivables Turnover = Revenue / Average Accounts Receivable
- [ ] Payables Turnover = COGS / Average Accounts Payable
- [ ] Days Sales Outstanding (DSO) = 365 / Receivables Turnover
- [ ] Days Inventory Outstanding (DIO) = 365 / Inventory Turnover
- [ ] Cash Conversion Cycle = DSO + DIO - DPO

**Valuation Ratios** (5):
- [ ] Price-to-Earnings (P/E) = Market Price per Share / EPS
- [ ] Price-to-Book (P/B) = Market Price per Share / Book Value per Share
- [ ] EV/EBITDA = Enterprise Value / EBITDA
- [ ] Price-to-Sales = Market Cap / Revenue
- [ ] Dividend Yield = Annual Dividends per Share / Price per Share

**Growth Ratios** (8):
- [ ] Revenue Growth (YoY) = (Current Year Revenue - Prior Year Revenue) / Prior Year Revenue
- [ ] EBITDA Growth (YoY)
- [ ] Net Income Growth (YoY)
- [ ] Operating Cash Flow Growth (YoY)
- [ ] Asset Growth (YoY)
- [ ] Equity Growth (YoY)
- [ ] EPS Growth (YoY)
- [ ] Compound Annual Growth Rate (CAGR) for 3-year periods

**Cash Flow Ratios** (8):
- [ ] Operating Cash Flow Margin = Operating CF / Revenue
- [ ] Free Cash Flow = Operating CF - CapEx
- [ ] Free Cash Flow Margin = Free CF / Revenue
- [ ] Cash Flow to Debt = Operating CF / Total Debt
- [ ] Cash Return on Assets = Operating CF / Total Assets
- [ ] Cash Flow Adequacy = Operating CF / (CapEx + Dividends + Debt Repayment)
- [ ] Dividend Payout Ratio (CF basis) = Dividends Paid / Operating CF
- [ ] Cash Conversion Rate = Operating CF / Net Income

#### 4. AI-Generated Narratives
- [ ] **OpenAI GPT-4 Integration**:
  - Prompt engineering for financial analysis
  - Generate 2-3 paragraph narrative per deal
  - Highlight strengths (top 3)
  - Highlight weaknesses (top 3)
  - Identify red flags (if any)
  - Growth signals analysis

- [ ] **Narrative Storage**:
  - Store generated narratives with timestamps
  - Version control (regenerate option)
  - Link to underlying ratio data

#### 5. Deal Readiness Score
- [ ] **Scoring Algorithm**:
  - Data quality score (0-25 points): Completeness of financial data
  - Financial health score (0-40 points): Weighted average of key ratios
  - Growth trajectory score (0-20 points): YoY growth trends
  - Risk assessment score (0-15 points): Leverage and liquidity
  - **Total**: 0-100 scale

- [ ] **Visual Indicator**:
  - Color-coded: Red (0-50), Yellow (51-75), Green (76-100)
  - Breakdown by category
  - Recommendations for improvement

#### 6. Backend API Endpoints

**Connection Management**:
- [ ] `POST /deals/{deal_id}/financial/connect/xero` - Initiate Xero OAuth
- [ ] `GET /deals/{deal_id}/financial/connect/xero/callback` - OAuth callback
- [ ] `POST /deals/{deal_id}/financial/connect/quickbooks` - Initiate QuickBooks OAuth
- [ ] `GET /deals/{deal_id}/financial/connect/quickbooks/callback` - OAuth callback
- [ ] `DELETE /deals/{deal_id}/financial/connection` - Disconnect accounting platform
- [ ] `GET /deals/{deal_id}/financial/connection/status` - Check connection status

**Data Operations**:
- [ ] `POST /deals/{deal_id}/financial/sync` - Manual data sync/refresh
- [ ] `GET /deals/{deal_id}/financial/statements` - Get financial statements
- [ ] `GET /deals/{deal_id}/financial/ratios` - Get all calculated ratios
- [ ] `GET /deals/{deal_id}/financial/narrative` - Get AI narrative
- [ ] `GET /deals/{deal_id}/financial/readiness-score` - Get Deal Readiness Score

#### 7. Frontend Dashboard
- [ ] **Financial Overview Page**:
  - Connection status card (connected/disconnected)
  - "Connect Accounting System" button (if not connected)
  - "Sync Data" button (if connected)
  - Last sync timestamp

- [ ] **Ratios Dashboard**:
  - Organized by category (tabs or sections)
  - Visual indicators (good/warning/bad)
  - Trend arrows (up/down/flat)
  - Historical comparison (if data available)

- [ ] **Narrative Display**:
  - Formatted text with markdown support
  - Strengths/Weaknesses/Red Flags sections
  - "Regenerate" button

- [ ] **Deal Readiness Score**:
  - Large circular gauge (0-100)
  - Color-coded background
  - Breakdown by score component
  - Recommendations list

### Nice to Have (Future Sprints)
- [ ] Sage and NetSuite integrations
- [ ] Automated daily/weekly sync
- [ ] Historical trend charts
- [ ] Peer benchmarking (compare to industry averages)
- [ ] Export to PDF report
- [ ] Custom ratio definitions
- [ ] Multi-period comparison

---

## 🏗️ Technical Specifications

### Database Schema

```python
class FinancialConnection(Base):
    """Store accounting platform OAuth connections"""
    __tablename__ = "financial_connections"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    platform = Column(String(50), nullable=False)  # 'xero', 'quickbooks'
    access_token = Column(Text, nullable=False)  # Encrypted
    refresh_token = Column(Text)  # Encrypted
    tenant_id = Column(String(255))  # Platform-specific tenant/company ID
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_sync_at = Column(DateTime(timezone=True))

class FinancialStatement(Base):
    """Store imported financial statements"""
    __tablename__ = "financial_statements"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    connection_id = Column(String(36), ForeignKey("financial_connections.id"))
    statement_type = Column(String(50))  # 'balance_sheet', 'income_statement', 'cash_flow'
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    data = Column(JSON, nullable=False)  # Raw financial data
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FinancialRatio(Base):
    """Store calculated financial ratios"""
    __tablename__ = "financial_ratios"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    period_end = Column(Date, nullable=False)
    ratio_category = Column(String(50))  # 'liquidity', 'profitability', etc.
    ratio_name = Column(String(100))  # 'current_ratio', etc.
    ratio_value = Column(Numeric(10, 4))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FinancialNarrative(Base):
    """Store AI-generated financial narratives"""
    __tablename__ = "financial_narratives"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    narrative_text = Column(Text, nullable=False)
    strengths = Column(JSON)  # Array of strength points
    weaknesses = Column(JSON)  # Array of weakness points
    red_flags = Column(JSON)  # Array of red flags
    readiness_score = Column(Integer)  # 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### Service Layer Architecture

```python
# app/services/financial_service.py

async def connect_xero(deal_id: str, auth_code: str, user: User, db: Session):
    """Complete Xero OAuth flow and store tokens"""
    pass

async def sync_financial_data(deal_id: str, connection_id: str, db: Session):
    """Import financial statements from accounting platform"""
    pass

def calculate_all_ratios(statements: List[FinancialStatement]) -> List[FinancialRatio]:
    """Calculate all 47 ratios from financial statements"""
    pass

async def generate_narrative(deal_id: str, ratios: List[FinancialRatio], db: Session) -> FinancialNarrative:
    """Use GPT-4 to generate financial narrative"""
    pass

def calculate_readiness_score(ratios: List[FinancialRatio], statements: List[FinancialStatement]) -> int:
    """Calculate Deal Readiness Score (0-100)"""
    pass
```

### External API Integration

**Xero**:
- Library: `xero-python` (v2.9.0)
- OAuth 2.0 with PKCE
- Endpoints: `/accounting/reports/BalanceSheet`, `/accounting/reports/ProfitAndLoss`

**QuickBooks**:
- Library: `intuitlib` (v0.3.0)
- OAuth 2.0
- Endpoints: `/v3/company/{realmId}/reports/BalanceSheet`, `/v3/company/{realmId}/reports/ProfitAndLoss`

**OpenAI**:
- Library: `openai` (v1.3.0)
- Model: GPT-4 (gpt-4-turbo-preview)
- Max tokens: 1000 for narratives

---

## 🧪 Test Plan (TDD)

### Unit Tests (Ratio Calculations)
```python
# tests/unit/test_financial_ratios.py

def test_current_ratio_calculation():
    """Test current ratio = current assets / current liabilities"""
    data = {
        "current_assets": 100000,
        "current_liabilities": 50000
    }
    assert calculate_current_ratio(data) == 2.0

def test_quick_ratio_calculation():
    """Test quick ratio excludes inventory"""
    data = {
        "current_assets": 100000,
        "inventory": 30000,
        "current_liabilities": 50000
    }
    assert calculate_quick_ratio(data) == 1.4

# ... 47 tests for 47 ratios
```

### Integration Tests (API Endpoints)
```python
# tests/integration/test_financial_endpoints.py

async def test_connect_xero_initiates_oauth(client, auth_headers, test_deal):
    """Test Xero OAuth initiation returns authorization URL"""
    response = await client.post(
        f"/deals/{test_deal.id}/financial/connect/xero",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert "authorization_url" in response.json()

async def test_sync_financial_data_imports_statements(client, auth_headers, test_deal, mock_xero):
    """Test data sync imports financial statements"""
    response = await client.post(
        f"/deals/{test_deal.id}/financial/sync",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["statements_imported"] > 0
```

### Frontend Tests
```typescript
// frontend/src/pages/financial/FinancialDashboard.test.tsx

describe('Financial Dashboard', () => {
  it('should display connect button when not connected', () => {
    render(<FinancialDashboard dealId="123" />);
    expect(screen.getByText('Connect Accounting System')).toBeInTheDocument();
  });

  it('should display ratios after sync', async () => {
    // Mock API response with ratios
    render(<FinancialDashboard dealId="123" />);
    await waitFor(() => {
      expect(screen.getByText('Current Ratio')).toBeInTheDocument();
      expect(screen.getByText('2.5')).toBeInTheDocument();
    });
  });
});
```

---

## 📊 Definition of Done

- [ ] All 47 financial ratios calculate correctly
- [ ] Xero integration fully functional (OAuth + data import)
- [ ] QuickBooks integration fully functional (OAuth + data import)
- [ ] AI narratives generate successfully
- [ ] Deal Readiness Score calculates accurately
- [ ] All API endpoints tested (50+ tests)
- [ ] Frontend dashboard displays all data correctly
- [ ] OAuth tokens stored securely (encrypted)
- [ ] Error handling for expired/revoked connections
- [ ] Code coverage ≥ 80%
- [ ] OpenAPI documentation complete
- [ ] Production deployment successful
- [ ] User documentation written

---

## 🚧 Dependencies & Blockers

### External Dependencies
- Xero Developer Account (for OAuth credentials)
- QuickBooks Developer Account (for OAuth credentials)
- OpenAI API Key (for GPT-4 access)

### Technical Dependencies
- Xero Python SDK: `xero-python>=2.9.0`
- QuickBooks SDK: `intuitlib>=0.3.0`
- OpenAI SDK: `openai>=1.3.0`
- Pandas: `pandas>=2.1.0` (for data processing)
- NumPy: `numpy>=1.24.0` (for calculations)

### Potential Blockers
- OAuth setup complexity (mitigation: follow SDK docs closely)
- Rate limiting on accounting APIs (mitigation: implement exponential backoff)
- Financial data inconsistency across platforms (mitigation: robust normalization layer)

---

## 📅 Implementation Timeline

### Week 1 (6-8 hours): Foundation
- Day 1-2: Database schema + migrations
- Day 2-3: Xero OAuth integration
- Day 3-4: QuickBooks OAuth integration
- Day 4-5: Data import service layer

### Week 2 (6-8 hours): Calculation Engine
- Day 6-7: Ratio calculation functions (all 47)
- Day 7-8: Unit tests for ratios
- Day 8-9: API endpoints for ratios
- Day 9-10: Integration tests

### Week 3 (4-6 hours): AI & Frontend
- Day 11-12: OpenAI narrative generation
- Day 12-13: Deal Readiness Score algorithm
- Day 13-14: Frontend dashboard (React components)
- Day 14-15: Frontend tests + integration

**Total**: 16-22 hours

---

## 🎯 Success Metrics

### Technical Metrics
- 50+ tests passing (100% of financial calculations)
- API response time < 2 seconds for ratio calculation
- OAuth success rate > 95%
- Data import success rate > 90%

### Business Metrics
- User can connect accounting platform in < 60 seconds
- Financial analysis completes in < 30 seconds
- Deal Readiness Score accuracy (validated against expert assessments)

---

## 📝 Notes

- Start with Xero (more popular in UK market)
- Use mocks for external API tests (don't hit real Xero/QuickBooks in CI/CD)
- Store OAuth tokens encrypted in database
- Implement token refresh before expiry
- Consider adding Celery task for async data sync (if sync takes > 5 seconds)

---

**Created**: October 24, 2025
**Story Owner**: Product Owner
**Developer**: Claude Code (TDD approach)
**Status**: 🎯 Ready for Implementation

---

**BMAD Methodology**: This story follows BMAD v6-alpha with complete acceptance criteria, technical specs, and test plan for autonomous TDD implementation.
