
export interface TestimonialResult {
  metric: string;
  value: string;
  description: string;
}

export interface TestimonialData {
  name: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  companySize: string;
  implementationDate: string;
  avatar: string;
  quote: string;
  results: TestimonialResult[];
  videoThumbnail: string;
  hasVideo: boolean;
  rating: number;
  beforeAfter: {
    before: string;
    after: string;
  };
}

export interface CompanyLogo {
  name: string;
  logo: string;
}
