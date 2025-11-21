
import { optimizedLazy } from './OptimizedLazyLoad';

// Lazy load industry pages
export const LazyConstructionIndustry = optimizedLazy(() => import('../pages/industries/ConstructionIndustry'));
export const LazyFinancialServicesIndustry = optimizedLazy(() => import('../pages/industries/FinancialServicesIndustry'));
export const LazyHealthcareIndustry = optimizedLazy(() => import('../pages/industries/HealthcareIndustry'));
export const LazyPrivateEquityIndustry = optimizedLazy(() => import('../pages/industries/PrivateEquityIndustry'));
export const LazyInvestmentBankingIndustry = optimizedLazy(() => import('../pages/industries/InvestmentBankingIndustry'));
export const LazyFamilyOfficeIndustry = optimizedLazy(() => import('../pages/industries/FamilyOfficeIndustry'));
export const LazyInsuranceIndustry = optimizedLazy(() => import('../pages/industries/InsuranceIndustry'));
export const LazyCapitalMarketsIndustry = optimizedLazy(() => import('../pages/industries/CapitalMarketsIndustry'));
export const LazyProfessionalServicesIndustry = optimizedLazy(() => import('../pages/industries/ProfessionalServicesIndustry'));
export const LazySubscriptionBusinessIndustry = optimizedLazy(() => import('../pages/industries/SubscriptionBusinessIndustry'));
export const LazyEcommerceIndustry = optimizedLazy(() => import('../pages/industries/EcommerceIndustry'));

// Lazy load implementation pages - preload these as they're critical
export const LazySageIntacctImplementation = optimizedLazy(() => import('../pages/implementation/SageIntacctImplementation'), true);
export const LazyAcumaticaImplementation = optimizedLazy(() => import('../pages/implementation/AcumaticaImplementation'), true);
export const LazyOdooImplementation = optimizedLazy(() => import('../pages/implementation/OdooImplementation'), true);
export const LazySageX3Implementation = optimizedLazy(() => import('../pages/implementation/SageX3Implementation'), true);

// Lazy load VSL pages
export const LazyConstructionVSLOptIn = optimizedLazy(() => import('../pages/vsl/ConstructionVSLOptIn'));
export const LazyConstructionVSLVideo = optimizedLazy(() => import('../pages/vsl/ConstructionVSLVideo'));
export const LazyConstructionVSLApplication = optimizedLazy(() => import('../pages/vsl/ConstructionVSLApplication'));
export const LazyConstructionVSLScheduling = optimizedLazy(() => import('../pages/vsl/ConstructionVSLScheduling'));
export const LazyConstructionVSLThankYou = optimizedLazy(() => import('../pages/vsl/ConstructionVSLThankYou'));

export const LazyHealthcareVSLOptIn = optimizedLazy(() => import('../pages/vsl/HealthcareVSLOptIn'));
export const LazyHealthcareVSLVideo = optimizedLazy(() => import('../pages/vsl/HealthcareVSLVideo'));
export const LazyHealthcareVSLApplication = optimizedLazy(() => import('../pages/vsl/HealthcareVSLApplication'));
export const LazyHealthcareVSLScheduling = optimizedLazy(() => import('../pages/vsl/HealthcareVSLScheduling'));
export const LazyHealthcareVSLThankYou = optimizedLazy(() => import('../pages/vsl/HealthcareVSLThankYou'));

export const LazyFinancialServicesVSLOptIn = optimizedLazy(() => import('../pages/vsl/FinancialServicesVSLOptIn'));
export const LazyFinancialServicesVSLVideo = optimizedLazy(() => import('../pages/vsl/FinancialServicesVSLVideo'));
export const LazyFinancialServicesVSLApplication = optimizedLazy(() => import('../pages/vsl/FinancialServicesVSLApplication'));
export const LazyFinancialServicesVSLScheduling = optimizedLazy(() => import('../pages/vsl/FinancialServicesVSLScheduling'));
export const LazyFinancialServicesVSLThankYou = optimizedLazy(() => import('../pages/vsl/FinancialServicesVSLThankYou'));

export const LazyPrivateEquityVSLOptIn = optimizedLazy(() => import('../pages/vsl/PrivateEquityVSLOptIn'));
export const LazyPrivateEquityVSLVideo = optimizedLazy(() => import('../pages/vsl/PrivateEquityVSLVideo'));
export const LazyPrivateEquityVSLApplication = optimizedLazy(() => import('../pages/vsl/PrivateEquityVSLApplication'));
export const LazyPrivateEquityVSLScheduling = optimizedLazy(() => import('../pages/vsl/PrivateEquityVSLScheduling'));
export const LazyPrivateEquityVSLThankYou = optimizedLazy(() => import('../pages/vsl/PrivateEquityVSLThankYou'));

export const LazyEcommerceVSLOptIn = optimizedLazy(() => import('../pages/vsl/EcommerceVSLOptIn'));
export const LazyEcommerceVSLVideo = optimizedLazy(() => import('../pages/vsl/EcommerceVSLVideo'));
export const LazyEcommerceVSLApplication = optimizedLazy(() => import('../pages/vsl/EcommerceVSLApplication'));
export const LazyEcommerceVSLScheduling = optimizedLazy(() => import('../pages/vsl/EcommerceVSLScheduling'));
export const LazyEcommerceVSLBlueprint = optimizedLazy(() => import('../pages/vsl/EcommerceVSLBlueprint'));
export const LazyEcommerceVSLThankYou = optimizedLazy(() => import('../pages/vsl/EcommerceVSLThankYou'));

export const LazyManufacturingVSLOptIn = optimizedLazy(() => import('../pages/vsl/ManufacturingVSLOptIn'));
export const LazyManufacturingVSLVideo = optimizedLazy(() => import('../pages/vsl/ManufacturingVSLVideo'));
export const LazyManufacturingVSLApplication = optimizedLazy(() => import('../pages/vsl/ManufacturingVSLApplication'));
export const LazyManufacturingVSLScheduling = optimizedLazy(() => import('../pages/vsl/ManufacturingVSLScheduling'));
export const LazyManufacturingVSLThankYou = optimizedLazy(() => import('../pages/vsl/ManufacturingVSLThankYou'));

export const LazyProfessionalServicesVSLOptIn = optimizedLazy(() => import('../pages/vsl/ProfessionalServicesVSLOptIn'));
export const LazyProfessionalServicesVSLVideo = optimizedLazy(() => import('../pages/vsl/ProfessionalServicesVSLVideo'));
export const LazyProfessionalServicesVSLApplication = optimizedLazy(() => import('../pages/vsl/ProfessionalServicesVSLApplication'));
export const LazyProfessionalServicesVSLScheduling = optimizedLazy(() => import('../pages/vsl/ProfessionalServicesVSLScheduling'));
export const LazyProfessionalServicesVSLThankYou = optimizedLazy(() => import('../pages/vsl/ProfessionalServicesVSLThankYou'));

// Export groups of components for preloading
export const implementationPages = [
  LazySageIntacctImplementation,
  LazyAcumaticaImplementation,
  LazyOdooImplementation
];

export const industryPages = [
  LazyConstructionIndustry,
  LazyFinancialServicesIndustry,
  LazyHealthcareIndustry,
  LazyPrivateEquityIndustry,
  LazyInvestmentBankingIndustry,
  LazyFamilyOfficeIndustry,
  LazyInsuranceIndustry,
  LazyCapitalMarketsIndustry,
  LazyProfessionalServicesIndustry,
  LazySubscriptionBusinessIndustry,
  LazyEcommerceIndustry
];
