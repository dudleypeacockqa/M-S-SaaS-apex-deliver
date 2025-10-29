import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, BarChart3, Building2, LineChart, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingNav from "@/components/MarketingNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent text-primary-foreground py-20 lg:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 text-primary-foreground">
              From Deal Flow to Cash Flow: The End-to-End M&A Intelligence Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 leading-relaxed">
              Stop juggling spreadsheets and disconnected tools. ApexDeliver, powered by CapLiquify, integrates every stage of your M&A lifecycle—from valuation and due diligence to post-merger integration and ongoing financial performance—into a single, intelligent, and automated platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <a href={getLoginUrl()}>Start Your Free 14-Day Trial</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/contact">Schedule a Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/70 italic">
              Trusted by dealmakers, finance leaders, and private equity firms worldwide. Backed by 20+ years of experience and over 230+ successful business transformations.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4">Your Entire M&A Workflow, Unified and Automated</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-secondary transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-3">Step 1: Land with CapLiquify (FP&A and Pricing)</h3>
                <p className="text-muted-foreground">
                  Gain immediate control over your cash flow and pricing strategy. Use our 13-week cash forecasting, working capital optimization, and advanced pricing engine to stabilize financials and drive profitability from day one. Perfect for post-merger integration or as a standalone FP&A powerhouse.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-3">Step 2: Expand to ApexDeliver (Full M&A Lifecycle)</h3>
                <p className="text-muted-foreground">
                  When you're ready for your next deal, activate the full ApexDeliver suite. Manage your deal pipeline, conduct AI-powered due diligence in a secure document room, build complex valuation models, and execute your M&A strategy with unparalleled precision and efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3">Step 3: Grow Your Portfolio (Enterprise & B2B2C)</h3>
                <p className="text-muted-foreground">
                  For private equity firms and strategic acquirers, manage your entire portfolio from a single dashboard. For your operating companies, deploy customer-facing portals for orders, invoices, and self-service, turning your finance function into a growth engine.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4">A Feature for Every Stage of Your Growth Journey</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="h-16 w-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="mb-3">CapLiquify FP&A Engine</h3>
              <p className="text-muted-foreground mb-4">
                Go beyond traditional accounting with a forward-looking financial planning and analysis engine. Model scenarios, forecast cash with 95%+ accuracy, and generate lender-ready reports in minutes.
              </p>
              <Link href="/features" className="text-secondary font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Learn More About CapLiquify <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="group">
              <div className="h-16 w-16 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mb-3">ApexDeliver M&A Suite</h3>
              <p className="text-muted-foreground mb-4">
                From AI-powered deal sourcing and automated due diligence to a valuation suite with 47+ financial ratios, ApexDeliver gives you an unfair advantage in a competitive market. Close deals faster, with more confidence.
              </p>
              <Link href="/features" className="text-accent font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Explore M&A Features <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="group">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3">B2B2C Customer Portals</h3>
              <p className="text-muted-foreground mb-4">
                Empower your customers with self-service portals integrated directly with your ERP. Reduce administrative overhead, improve customer satisfaction, and get paid faster.
              </p>
              <Link href="/features" className="text-primary font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Discover Customer Portals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Powerful, Transparent Pricing That Scales With You</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're a solo dealmaker, a growing firm, or a large enterprise, we have a plan that fits your needs. Start with our powerful CapLiquify FP&A tools and expand to the full ApexDeliver M&A platform as you grow. All plans start with a risk-free 14-day trial.
            </p>
            <Button size="lg" asChild>
              <Link href="/pricing">View Full Pricing & Features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-primary-foreground">Ready to Transform Your M&A and Finance Operations?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Take the first step towards a more intelligent, automated, and profitable future. Start your free trial today and experience the power of a truly unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <a href={getLoginUrl()}>Start Your Free 14-Day Trial</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
