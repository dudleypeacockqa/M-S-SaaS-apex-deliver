import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, ArrowRight } from "lucide-react";

// --- Mock Data for a Single Blog Post ---
const mockPost = {
  id: "merger-synergy-unlocked",
  title: "Unlocking Post-Merger Synergy: A Deep Dive for ApexDeliver Clients",
  heroImageUrl: "/images/blog/merger-synergy-hero.jpg",
  author: {
    name: "Dr. Evelyn Reed",
    title: "Chief M&A Strategist",
    avatarUrl: "/images/avatars/evelyn-reed.png",
    bio: "Dr. Reed specializes in financial modeling and integration strategy for mid-market acquisitions.",
  },
  publishDate: "October 26, 2025",
  readTime: "12 min read",
  contentHtml: `
    <p class="text-lg mb-6 leading-relaxed">
      The true value of a merger or acquisition is not realized at the signing of the deal, but in the rigorous, often challenging, post-merger integration (PMI) phase. For our clients leveraging <strong>ApexDeliver</strong> for seamless transaction management and <strong>CapLiquify</strong> for optimized capital structure, understanding and executing synergy capture is paramount.
    </p>
    <h2 class="text-2xl font-bold mt-8 mb-4 text-gray-800">The Synergy Gap: Why Deals Fail to Deliver</h2>
    <p class="mb-6 leading-relaxed">
      Studies consistently show that up to 70% of M&A deals fail to achieve their projected synergy targets. This "synergy gap" is typically a result of poor communication, cultural clashes, and, most critically, a lack of a clear, actionable integration roadmap. Our approach emphasizes a data-driven PMI process, turning theoretical cost and revenue synergies into measurable, realized value.
    </p>
    <blockquote class="border-l-4 border-emerald-500 pl-4 italic text-gray-600 my-6">
      "Synergy is not a promise; it's a project. It requires the same level of discipline and financial scrutiny as the initial valuation."
    </blockquote>
    <h3 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Three Pillars of Successful PMI</h3>
    <ol class="list-decimal list-inside space-y-2 mb-6 ml-4">
      <li><strong>Financial Alignment:</strong> Immediately integrate financial reporting systems to track synergy realization against the original pro forma.</li>
      <li><strong>Operational Streamlining:</strong> Use a phased approach to combine redundant functions, prioritizing quick wins to build momentum.</li>
      <li><strong>Cultural Integration:</strong> Establish a joint leadership team and clear communication channels to mitigate employee anxiety and retain key talent.</li>
    </ol>
    <p class="mb-6 leading-relaxed">
      By applying the principles of <strong>CapLiquify's</strong> capital efficiency framework to the PMI budget, clients can ensure that every dollar spent on integration is an investment, not an expense. This disciplined approach is what separates value-additive deals from value-destructive ones.
    </p>
  `,
};

// --- Mock Data for Related Posts ---
const mockRelatedPosts = [
  {
    id: "capital-structure-optimization",
    title: "How CapLiquify Optimizes Capital Structure for Growth",
    excerpt: "A deep dive into debt-equity ratios and strategic financing for M&A targets.",
    category: "Finance",
    date: "Oct 15, 2025",
  },
  {
    id: "due-diligence-checklist",
    title: "The Ultimate Due Diligence Checklist for Tech Acquisitions",
    excerpt: "A comprehensive guide to technical, legal, and financial due diligence.",
    category: "M&A Strategy",
    date: "Sep 28, 2025",
  },
  {
    id: "exit-strategy-planning",
    title: "Planning Your Exit: From Seed to Strategic Acquisition",
    excerpt: "Understanding the timeline and valuation multiples for a successful company sale.",
    category: "Strategy",
    date: "Sep 01, 2025",
  },
];

// --- Sub-Components ---

interface RelatedPostCardProps {
  post: (typeof mockRelatedPosts)[0];
}

const RelatedPostCard: React.FC<RelatedPostCardProps> = ({ post }) => (
  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-navy-800 hover:text-emerald-600 transition-colors">
        <a href={`/blog/${post.id}`}>{post.title}</a>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
    </CardContent>
    <CardFooter className="flex justify-between items-center text-xs text-gray-500">
      <span className="px-2 py-0.5 bg-bright-100 text-bright-700 rounded-full font-medium">
        {post.category}
      </span>
      <span>{post.date}</span>
    </CardFooter>
  </Card>
);

const AuthorInfo: React.FC<typeof mockPost["author"]> = ({ name, title, avatarUrl, bio }) => (
  <div className="flex items-center space-x-4 p-4 border-t border-b border-gray-200 my-8">
    <img
      src={avatarUrl}
      alt={name}
      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
    />
    <div>
      <h4 className="text-xl font-bold text-navy-800">{name}</h4>
      <p className="text-emerald-600 font-medium">{title}</p>
      <p className="text-sm text-gray-600 mt-1">{bio}</p>
    </div>
  </div>
);

const CallToAction: React.FC = () => (
  <div className="bg-navy-800 p-8 md:p-12 text-center rounded-lg shadow-xl my-12">
    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
      Ready to Deliver Your Next Deal?
    </h2>
    <p className="text-xl text-bright-200 mb-8 max-w-3xl mx-auto">
      Connect with our M&A experts today to see how ApexDeliver and CapLiquify can accelerate your transaction lifecycle and maximize capital efficiency.
    </p>
    <Button
      variant="default"
      size="lg"
      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg px-8 py-6 transition-all duration-300 group"
    >
      Schedule a Consultation
      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Button>
  </div>
);

// --- Main Component ---

const BlogPost: React.FC = () => {
  // Define custom colors for the M&A/Finance branding
  // Assuming these colors are defined in a global CSS or Tailwind config
  // Navy Blue: navy-800
  // Emerald Green: emerald-500
  // Bright Blue: bright-500

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />

      <main className="flex-grow">
        <article className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
          {/* Hero Section */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-navy-800 mb-4 leading-tight">
              {mockPost.title}
            </h1>
            <div className="flex justify-center space-x-4 text-gray-500 text-sm md:text-base">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-gray-700">{mockPost.author.name}</span>
              </div>
              <Separator orientation="vertical" className="h-5 bg-gray-300" />
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>{mockPost.publishDate}</span>
              </div>
              <Separator orientation="vertical" className="h-5 bg-gray-300" />
              <span>{mockPost.readTime}</span>
            </div>
          </header>

          {/* Hero Image */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={mockPost.heroImageUrl}
              alt={mockPost.title}
              className="w-full h-96 object-cover"
              aria-label="Hero image illustrating the blog post topic"
            />
          </div>

          {/* Post Content and Author Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <section
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: mockPost.contentHtml }}
              />
            </div>
            
            {/* Sidebar/Author Bio - Placeholder for a sticky sidebar on larger screens */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-8 shadow-lg border-t-4 border-emerald-500">
                <CardHeader>
                  <CardTitle className="text-xl text-navy-800">About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={mockPost.author.avatarUrl}
                      alt={mockPost.author.name}
                      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-bright-500"
                    />
                    <h4 className="text-xl font-bold text-navy-800">{mockPost.author.name}</h4>
                    <p className="text-emerald-600 font-medium text-sm mb-3">{mockPost.author.title}</p>
                    <p className="text-sm text-gray-600">{mockPost.author.bio}</p>
                    <Button variant="link" className="mt-2 text-bright-500 hover:text-bright-600">
                      View all posts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>

          {/* Full-width Author Info (for mobile/bottom) - Re-adding for better mobile flow and accessibility */}
          <AuthorInfo {...mockPost.author} />

          {/* CTA Section */}
          <CallToAction />

          {/* Related Posts Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-navy-800 mb-8 border-b-2 border-emerald-500 pb-2">
              Related Insights & Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mockRelatedPosts.map((post) => (
                <RelatedPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </article>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default BlogPost;