
import { TestimonialData, CompanyLogo } from "./types";

export const testimonials: TestimonialData[] = [
  {
    name: "Sarah Williams",
    title: "Finance Director",
    company: "TechFlow Solutions",
    location: "London, UK",
    industry: "Technology",
    companySize: "150+ employees",
    implementationDate: "March 2024",
    avatar: "SW",
    quote: "FinanceFlo.ai has completely transformed our finance operations. We've reduced our month-end closing time from 5 days to just 6 hours, and our team can now focus on strategic analysis instead of manual data entry.",
    results: [
      { metric: "Time Saved", value: "87%", description: "Reduction in manual processing" },
      { metric: "Accuracy", value: "99.8%", description: "Error-free transactions" },
      { metric: "ROI", value: "340%", description: "Return on investment" }
    ],
    videoThumbnail: "/api/placeholder/400/225",
    hasVideo: true,
    rating: 5,
    beforeAfter: {
      before: "5 days month-end closing",
      after: "6 hours month-end closing"
    }
  },
  {
    name: "Michael Chen",
    title: "Chief Financial Officer",
    company: "GreenTech Industries",
    location: "Manchester, UK",
    industry: "Manufacturing",
    companySize: "300+ employees",
    implementationDate: "January 2024",
    avatar: "MC",
    quote: "The AI-powered invoice processing is incredible. We're now processing 300% more invoices with the same team size. The predictive analytics have helped us identify cost-saving opportunities worth £2.3M annually.",
    results: [
      { metric: "Volume Increase", value: "300%", description: "More invoices processed" },
      { metric: "Cost Savings", value: "£2.3M", description: "Annual savings identified" },
      { metric: "Team Efficiency", value: "250%", description: "Productivity improvement" }
    ],
    videoThumbnail: "/api/placeholder/400/225",
    hasVideo: true,
    rating: 5,
    beforeAfter: {
      before: "Manual invoice processing",
      after: "AI-automated processing"
    }
  },
  {
    name: "Emma Thompson",
    title: "Head of Finance",
    company: "Retail Plus Ltd",
    location: "Birmingham, UK",
    industry: "Retail",
    companySize: "75+ employees",
    implementationDate: "February 2024",
    avatar: "ET",
    quote: "Real-time reporting has given us unprecedented visibility into our cash flow. We can make decisions faster than ever, and the integration with our existing ERP was seamless. Best investment we've made.",
    results: [
      { metric: "Decision Speed", value: "75%", description: "Faster strategic decisions" },
      { metric: "Cash Flow Visibility", value: "Real-time", description: "Live financial insights" },
      { metric: "Implementation", value: "2 weeks", description: "From start to go-live" }
    ],
    videoThumbnail: "/api/placeholder/400/225",
    hasVideo: false,
    rating: 5,
    beforeAfter: {
      before: "Weekly financial reports",
      after: "Real-time dashboards"
    }
  }
];

export const companyLogos: CompanyLogo[] = [
  { name: "TechFlow Solutions", logo: "TF" },
  { name: "GreenTech Industries", logo: "GT" },
  { name: "Retail Plus Ltd", logo: "RP" },
  { name: "Construction Pro", logo: "CP" },
  { name: "Healthcare Systems", logo: "HS" },
  { name: "Finance Partners", logo: "FP" }
];
