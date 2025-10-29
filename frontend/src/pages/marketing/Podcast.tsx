import { ArrowRight, Calendar, ExternalLink, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Assume these components exist in the project structure
const MarketingNav = () => (
  <header className="sticky top-0 z-50 w-full border-b border-navy-blue/10 bg-white/90 backdrop-blur-sm">
    <div className="container flex h-16 items-center justify-between">
      <span className="text-xl font-bold text-navy-blue">ApexDeliver</span>
      <nav className="hidden space-x-4 md:flex">
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-emerald-green">Services</a>
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-emerald-green">About</a>
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-emerald-green">Podcast</a>
        <Button variant="outline" className="border-emerald-green text-emerald-green hover:bg-emerald-green/10">Contact</Button>
      </nav>
      <Button variant="ghost" className="md:hidden">Menu</Button>
    </div>
  </header>
);

const MarketingFooter = () => (
  <footer className="border-t border-navy-blue/10 bg-gray-50 py-12">
    <div className="container grid grid-cols-2 gap-8 md:grid-cols-4">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-blue">Company</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">About Us</a></li>
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Careers</a></li>
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Press</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-blue">Services</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">M&A Advisory</a></li>
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Capital Liquidity</a></li>
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Due Diligence</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-blue">Resources</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Blog</a></li>
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Podcast</a></li>
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Case Studies</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-blue">Legal</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Terms of Service</a></li>
          <li><a href="#" className="text-sm text-gray-600 hover:text-emerald-green">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    <div className="container mt-8 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} ApexDeliver & CapLiquify. All rights reserved.
    </div>
  </footer>
);

// Mock data for podcast episodes
const mockEpisodes = [
  {
    id: 1,
    title: "The Anatomy of a Successful Exit: A Founder's Perspective",
    date: "2025-10-15",
    duration: "45 min",
    summary: "In this premiere episode, we sit down with Jane Doe, founder of TechNova, to discuss her journey through the M&A process, from initial contact to the final closing. Key takeaways on valuation and team alignment.",
    link: "#",
  },
  {
    id: 2,
    title: "Capitalizing on Market Shifts: Liquidity Strategies for 2026",
    date: "2025-10-08",
    duration: "38 min",
    summary: "Our experts dive into current macroeconomic trends and how businesses can leverage strategic capital liquidity to prepare for future growth or a potential sale. Focus on private equity and debt financing.",
    link: "#",
  },
  {
    id: 3,
    title: "Due Diligence Deep Dive: What Buyers Really Look For",
    date: "2025-10-01",
    duration: "52 min",
    summary: "A candid conversation about the most common pitfalls in the due diligence phase. Learn how to prepare your financials, legal documents, and operational processes to ensure a smooth transaction.",
    link: "#",
  },
];

// Tailwind Color Palette Mapping (for reference, using direct colors in class names)
// Navy Blue: bg-gray-900, text-gray-900, border-gray-900 (or a custom dark blue) -> using a custom dark blue via arbitrary value or a close tailwind default like `slate-900`
// Emerald Green: text-emerald-500, bg-emerald-500
// Bright Blue: text-blue-500, bg-blue-500

const PodcastPage = () => {
  // Custom colors for branding
  const navyBlueText = "text-[#0A1931]"; // A deep, professional navy
  const emeraldGreenText = "text-[#00C49A]"; // A vibrant emerald
  const brightBlueBg = "bg-[#1E90FF]"; // A bright, professional blue

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="container max-w-4xl text-center">
            <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 ${navyBlueText}`}>
              100 Days and Beyond
            </h1>
            <p className={`text-xl md:text-2xl mb-8 font-light ${navyBlueText}/80`}>
              The official podcast of ApexDeliver & CapLiquify. Unpacking the M&A lifecycle, from the first 100 days of integration to long-term capital strategy.
            </p>
            <Button size="lg" className={`text-lg px-8 ${brightBlueBg} hover:bg-blue-600 transition-colors`}>
              <PlayCircle className="mr-2 h-5 w-5" />
              Listen to the Latest Episode
            </Button>
          </div>
        </section>

        {/* YouTube Playlist Embed Placeholder */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${navyBlueText}`}>
              Featured Episodes
            </h2>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-gray-100">
              {/* Placeholder for YouTube Embed */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <PlayCircle className={`h-16 w-16 mx-auto mb-4 ${emeraldGreenText}`} />
                  <p className="text-lg font-medium text-gray-600">
                    YouTube Playlist Embed Placeholder
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Playlist ID: PLxxxxxxxxxxxxxx
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button variant="link" className={emeraldGreenText}>
                View Full Playlist on YouTube <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Episode Descriptions */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center ${navyBlueText}`}>
              All Episodes
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {mockEpisodes.map((episode) => (
                <Card key={episode.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <CardHeader>
                    <CardTitle className={navyBlueText}>
                      <span className={`text-sm font-semibold block mb-1 ${emeraldGreenText}`}>
                        Episode {episode.id}
                      </span>
                      {episode.title}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 pt-2">
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(episode.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-sm text-gray-500">
                        &bull; {episode.duration}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-700 leading-relaxed">{episode.summary}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className={`w-full justify-between ${emeraldGreenText} hover:bg-emerald-green/10`}>
                      Listen Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Call to Action for more episodes */}
            <div className="mt-16 text-center">
                <Button size="lg" variant="outline" className={`text-lg px-8 border-2 border-emerald-green ${emeraldGreenText} hover:bg-emerald-green/10`}>
                    Browse All 25+ Episodes
                </Button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default PodcastPage;

// --- Custom Tailwind Configuration Mock (for context, not part of the TSX file) ---
// In a real setup, these colors would be defined in tailwind.config.js
// extend: {
//   colors: {
//     'navy-blue': '#0A1931',
//     'emerald-green': '#00C49A',
//     'bright-blue': '#1E90FF',
//   },
// },
// Since I cannot modify tailwind.config.js, I use arbitrary values where necessary,
// but primarily rely on close Tailwind defaults and the provided class names.
// The code uses arbitrary values for text colors to match the branding exactly.
