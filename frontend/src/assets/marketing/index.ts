import dealPipelineIcon from './icons/deal-pipeline.svg'
import financialIntelligenceIcon from './icons/financial-intelligence.svg'
import valuationSuiteIcon from './icons/valuation-suite.svg'
import secureDocumentRoomIcon from './icons/secure-document-room.svg'
import dealMatchingIcon from './icons/deal-matching.svg'
import documentGenerationIcon from './icons/document-generation.svg'
import workflowAutomationIcon from './icons/workflow-automation.svg'
import professionalCommunityIcon from './icons/professional-community.svg'
import postMergerIntegrationIcon from './icons/post-merger-integration.svg'

import dealFlowIllustration from './illustrations/deal-flow-illustration.svg'
import financialIntelligenceIllustration from './illustrations/financial-intelligence-illustration.svg'
import valuationSuiteIllustration from './illustrations/valuation-suite-illustration.svg'
import secureDataRoomIllustration from './illustrations/secure-data-room-illustration.svg'
import aiDealMatchingIllustration from './illustrations/ai-deal-matching-illustration.svg'
import documentAutomationIllustration from './illustrations/document-automation-illustration.svg'
import workflowAutomationIllustration from './illustrations/workflow-automation-illustration.svg'
import communityIllustration from './illustrations/community-illustration.svg'

import jamesDavidsonAvatar from './avatars/james-davidson.svg'
import sarahReynoldsAvatar from './avatars/sarah-reynolds.svg'
import michaelParkAvatar from './avatars/michael-park.svg'
import emmaThompsonAvatar from './avatars/emma-thompson.svg'
import davidChenAvatar from './avatars/david-chen.svg'

import auroraStrategiesLogo from './logos/aurora-strategies.svg'
import horizonCapitalLogo from './logos/horizon-capital.svg'
import sterlingAdvisorsLogo from './logos/sterling-advisors.svg'
import pacificBridgeLogo from './logos/pacific-bridge.svg'
import summitEquityLogo from './logos/summit-equity.svg'
import northernRidgeLogo from './logos/northern-ridge.svg'
import atlasConsultingLogo from './logos/atlas-consulting.svg'
import zenithHoldingsLogo from './logos/zenith-holdings.svg'
import integrationXeroLogo from './logos/integration-xero.svg'
import integrationQuickBooksLogo from './logos/integration-quickbooks.svg'
import integrationSageLogo from './logos/integration-sage.svg'
import integrationNetSuiteLogo from './logos/integration-netsuite.svg'
import integrationStripeLogo from './logos/integration-stripe.svg'
import integrationSlackLogo from './logos/integration-slack.svg'

export const marketingFeatureIcons = {
  dealPipeline: { src: dealPipelineIcon, alt: 'Deal pipeline visualization icon' },
  financialIntelligence: { src: financialIntelligenceIcon, alt: 'Financial intelligence analytics icon' },
  valuationSuite: { src: valuationSuiteIcon, alt: 'Valuation suite analytics icon' },
  secureDocumentRoom: { src: secureDocumentRoomIcon, alt: 'Secure document vault icon' },
  dealMatching: { src: dealMatchingIcon, alt: 'AI deal matching icon' },
  documentGeneration: { src: documentGenerationIcon, alt: 'Automated document generation icon' },
  workflowAutomation: { src: workflowAutomationIcon, alt: 'Workflow automation icon' },
  professionalCommunity: { src: professionalCommunityIcon, alt: 'Professional community icon' },
  postMergerIntegration: { src: postMergerIntegrationIcon, alt: 'Post-merger integration icon' }
} as const

export const marketingAvatars = {
  jamesDavidson: { src: jamesDavidsonAvatar, alt: 'James Davidson, Independent M&A Advisor' },
  sarahReynolds: { src: sarahReynoldsAvatar, alt: 'Sarah Reynolds, VP Growth Equity' },
  michaelPark: { src: michaelParkAvatar, alt: 'Michael Park, Corporate Development Director' },
  emmaThompson: { src: emmaThompsonAvatar, alt: 'Emma Thompson, Managing Partner' },
  davidChen: { src: davidChenAvatar, alt: 'David Chen, Principal at Pacific Bridge Capital' }
} as const

export const marketingPartnerLogos = [
  { src: auroraStrategiesLogo, name: 'Aurora Strategies' },
  { src: horizonCapitalLogo, name: 'Horizon Capital' },
  { src: sterlingAdvisorsLogo, name: 'Sterling Advisors' },
  { src: pacificBridgeLogo, name: 'Pacific Bridge Capital' },
  { src: summitEquityLogo, name: 'Summit Equity Group' },
  { src: northernRidgeLogo, name: 'Northern Ridge Partners' },
  { src: atlasConsultingLogo, name: 'Atlas Consulting' },
  { src: zenithHoldingsLogo, name: 'Zenith Holdings' }
] as const

export const marketingIntegrationLogos = [
  { src: integrationXeroLogo, name: 'Xero accounting integration' },
  { src: integrationQuickBooksLogo, name: 'QuickBooks accounting integration' },
  { src: integrationSageLogo, name: 'Sage accounting integration' },
  { src: integrationNetSuiteLogo, name: 'NetSuite ERP integration' },
  { src: integrationStripeLogo, name: 'Stripe payment integration' },
  { src: integrationSlackLogo, name: 'Slack collaboration integration' }
] as const

export const marketingIllustrations = {
  dealFlow: { src: dealFlowIllustration, alt: 'Kanban style deal pipeline with multiple stages' },
  financialIntelligence: { src: financialIntelligenceIllustration, alt: 'Financial analytics dashboard highlighting real-time ratios' },
  valuationSuite: { src: valuationSuiteIllustration, alt: 'Valuation comparison across methods with sensitivity chart' },
  secureDataRoom: { src: secureDataRoomIllustration, alt: 'Secure data room vault protecting confidential documents' },
  aiDealMatching: { src: aiDealMatchingIllustration, alt: 'AI network linking buyer and seller profiles with match scores' },
  documentAutomation: { src: documentAutomationIllustration, alt: 'Automated document workflow with AI-generated clauses' },
  workflowAutomation: { src: workflowAutomationIllustration, alt: 'Connected automation nodes showing completed tasks' },
  community: { src: communityIllustration, alt: 'Professional community feed with events and member spotlights' }
} as const
