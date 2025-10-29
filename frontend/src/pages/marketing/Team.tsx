import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Assuming these components exist in the project structure
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

// Define the structure for a team member
interface TeamMember {
  name: string;
  title: string;
  initials: string;
  imageUrl: string; // Placeholder for image URL
}

// Team member data
const teamMembers: TeamMember[] = [
  {
    name: "Dudley Peacock",
    title: "Founder & CEO",
    initials: "DP",
    imageUrl: "/placeholder-dudley.jpg",
  },
  {
    name: "Sandra Peacock",
    title: "Managing Director",
    initials: "SP",
    imageUrl: "/placeholder-sandra.jpg",
  },
  {
    name: "Matthew Collins",
    title: "CFO",
    initials: "MC",
    imageUrl: "/placeholder-matthew.jpg",
  },
  {
    name: "Adam Pavitt",
    title: "Director of Operations",
    initials: "AP",
    imageUrl: "/placeholder-adam.jpg",
  },
  {
    name: "Shaun Evertse",
    title: "E-Commerce Expert",
    initials: "SE",
    imageUrl: "/placeholder-shaun.jpg",
  },
  {
    name: "Heike Venter",
    title: "ERP Sales Manager",
    initials: "HV",
    imageUrl: "/placeholder-heike.jpg",
  },
];

const TeamPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />

      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gray-900">
                Meet Our <span className="text-emerald-600">Leadership</span>
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                A dedicated team of experts driving success in M&A and financial solutions.
              </p>
            </header>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card
                  key={member.name}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-emerald-600"
                >
                  <CardHeader className="flex flex-col items-center p-6 pb-0">
                    <Avatar className="h-24 w-24 mb-4 ring-4 ring-bright-blue-500 ring-offset-2">
                      <AvatarImage src={member.imageUrl} alt={member.name} />
                      <AvatarFallback className="bg-navy-blue-600 text-white text-2xl font-semibold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl font-bold text-gray-900 text-center">
                      {member.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 text-center">
                    <p className="text-emerald-600 font-medium">{member.title}</p>
                    {/* Placeholder for a short bio/quote */}
                    <p className="mt-3 text-sm text-gray-500 italic">
                      "Committed to delivering exceptional value and strategic growth for our clients."
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Optional: A section for company values or mission */}
        <section className="bg-navy-blue-800 text-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                <p className="text-lg text-navy-blue-200 max-w-4xl mx-auto">
                    Integrity, Expertise, and Partnership are the foundations of every client relationship. We believe in transparent communication and relentless dedication to achieving your financial goals.
                </p>
            </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default TeamPage;

// --- Tailwind Color Palette Reference (Conceptual) ---
// Navy Blue: bg-navy-blue-800, text-navy-blue-600, etc. (using utility classes like bg-blue-900 or custom config)
// Emerald Green: text-emerald-600, border-t-emerald-600, etc. (using utility classes)
// Bright Blue: ring-bright-blue-500 (using utility classes like ring-blue-500)
// Note: Assuming a custom Tailwind config is set up for 'navy-blue', 'emerald', and 'bright-blue' or using closest default colors (e.g., blue-900, emerald-600, blue-500).
// For this output, standard Tailwind classes are used for the specified colors:
// Navy Blue -> blue-900, blue-800, blue-200 (simulated)
// Emerald Green -> emerald-600
// Bright Blue -> blue-500 (simulated)
