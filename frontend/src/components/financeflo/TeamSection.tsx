import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Phone } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Dudley Peacock",
    role: "Founder & CEO",
    description: "ERP Systems Specialist and Fractional AI Officer with 20+ years of experience. Led 230+ ERP implementations for mid-sized and multinational companies, achieving consistent 20%-30% annual growth. Expert in the Adaptive Intelligence Framework™ combining AI and ERP for transformational business results.",
    image: "/images/team/Dudley Peacock Profile.jpg",
    email: "dudley@financeflo.ai",
    phone: "+44 730 660 4807"
  },
  {
    name: "Sandra Peacock",
    role: "Managing Director",
    description: "Turning business challenges into success stories, Sandra leads our mission to make ERP actually work for businesses. With extensive experience in business transformation and strategic leadership, she ensures every implementation delivers measurable results and drives organizational growth.",
    image: "/images/team/Sandra Peacock Profile.jpg"
  },
  {
    name: "Matthew Comins",
    role: "CFO",
    description: "Bringing strategic financial leadership and deep expertise in finance transformation, Matthew ensures that our AI-powered ERP solutions deliver measurable financial results. As CFO, he combines extensive experience in financial management with cutting-edge technology to help businesses achieve sustainable growth and operational excellence through intelligent financial systems.",
    image: "/images/team/Matthew Comins Profile.jpg"
  },
  {
    name: "Adam Pavitt",
    role: "Director of Operations",
    description: "Driving operational excellence and strategic implementation across all business functions, Adam ensures seamless delivery of our AI-enhanced ERP solutions. As Director of Operations, he combines operational expertise with technology innovation to optimize business processes, enhance team performance, and deliver exceptional client outcomes through streamlined operations.",
    image: "/images/team/Adam Pavitt Profile.jpg"
  },
  {
    name: "Shaun Evertse",
    role: "E-Commerce, Warehousing & Supply Chain Expert",
    description: "Leading digital transformation and supply chain optimization initiatives, Shaun brings CEO-level expertise from Eazybranch and IngenuIT Software Solutions. With deep experience in e-commerce operations, warehousing management, and logistics technology, he helps businesses build resilient, scalable supply chains that drive competitive advantage and operational efficiency in the digital economy.",
    image: "/images/team/Shaun Evertse Profile.jpg"
  },
  {
    name: "Heike van der Westhuizen",
    role: "ERP Sales Manager",
    description: "Making sure every solution fits perfectly, Heike helps businesses find exactly what they need to grow. As our ERP Sales Manager, she specializes in understanding complex business requirements and matching them with the right AI-powered ERP solutions to maximize ROI and operational efficiency.",
    image: "/images/team/Heike van der Westhuizen Profile.jpg"
  },
  {
    name: "Brian Bakker",
    role: "Content and Brand Manager",
    description: "Crafting compelling narratives and building brand excellence, Brian ensures that FinanceFlo.ai's message resonates with finance leaders across all channels. As Content and Brand Manager, he combines strategic marketing expertise with deep understanding of AI and ERP to create content that educates, engages, and converts prospects into successful clients.",
    image: "/images/team/Brian Bakker Profile.jpg"
  },
  {
    name: "Tanya van der Merwe",
    role: "Finance and Admin Manager",
    description: "Ensuring operational excellence and financial integrity, Tanya manages the administrative backbone that supports our ERP implementations. Her expertise in finance and administration ensures that our internal processes are as streamlined and efficient as the solutions we deliver to our clients.",
    image: "/images/team/Tanya van der Merwe Profile.jpg"
  },
  {
    name: "Sheree Snyman",
    role: "ERP Project Manager",
    description: "Leading successful ERP transformations from start to finish, Sheree brings methodical project management expertise to every implementation. She ensures that complex ERP deployments are delivered on time, within budget, and exceed client expectations through careful planning, risk management, and stakeholder coordination.",
    image: "/images/team/Sheree Snyman Profile.jpg"
  },
  {
    name: "Liza Thompson",
    role: "Senior Task Coordinator",
    description: "Getting things done right, Liza ensures every implementation delivers real results with minimum hassle. As Senior Task Coordinator, she manages complex ERP projects from conception to successful deployment, coordinating cross-functional teams and maintaining project timelines to ensure seamless business transformation.",
    image: "/images/team/Liza Thompson Profile.jpg"
  },
  {
    name: "Riaan Ahlers",
    role: "ERP Sales Specialist",
    description: "Connecting businesses with transformational ERP solutions, Riaan brings deep technical knowledge and sales expertise to help organizations understand the true potential of AI-powered ERP systems. He specializes in consultative selling, ensuring clients receive solutions that align perfectly with their business objectives.",
    image: "/images/team/Riaan Ahlers Profile.jpg"
  },
  {
    name: "Ntiyiso Mahlaule",
    role: "ERP Consultant",
    description: "Delivering expert ERP guidance and implementation support, Ntiyiso combines technical expertise with business acumen to help organizations maximize their ERP investments. His consulting approach focuses on understanding unique business processes and configuring systems to drive operational excellence and competitive advantage.",
    image: "/images/team/Ntiyiso Mahlaule Profile.jpg"
  },
  {
    name: "Tebogo Mashego",
    role: "ERP Consultant",
    description: "Providing specialized ERP consulting services, Tebogo helps businesses navigate complex system implementations and optimizations. With a focus on user adoption and process improvement, he ensures that ERP solutions not only meet technical requirements but also drive meaningful business transformation and user satisfaction.",
    image: "/images/team/Tebogo Mashego Profile.jpg"
  },
  {
    name: "Maliaka Frieslaar",
    role: "Assistant Task Coordinator",
    description: "Supporting seamless project execution and client communication, Maliaka brings fresh energy and meticulous attention to detail to our implementation team. As Assistant Task Coordinator, she ensures that every project milestone is tracked, documented, and delivered with precision, while maintaining excellent client relationships and supporting senior coordinators in achieving exceptional project outcomes.",
    image: "/images/team/Maliaka Frieslaar Profile.jpg"
  }
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Meet the Team Behind Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 ml-3">
              Success
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our world-class team combines decades of ERP expertise with cutting-edge AI innovation 
            to deliver transformational results for finance leaders across the globe.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100">
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      width="500"
                      height="500"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{
                        objectFit: 'cover',
                        objectPosition: member.name === 'Sandra Peacock'
                          ? 'center 30%'
                          : member.name === 'Heike van der Westhuizen'
                          ? 'center 20%'
                          : member.name === 'Maliaka Frieslaar'
                          ? 'center 25%'
                          : member.name === 'Shaun Evertse'
                          ? 'center 15%'
                          : 'center top'
                      }}
                      onError={(e) => {
                        // Fallback for missing images
                        const target = e.target as HTMLImageElement;
                        target.src = "/DudleyPeacocknobackgroundimageprofile.png";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 mb-4">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {member.description}
                  </p>

                  {/* Contact Information */}
                  {(member.email || member.phone || member.linkedin) && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{member.phone}</span>
                        </a>
                      )}
                      {member.linkedin && (
                        <button
                          onClick={() => window.open(member.linkedin, '_blank', 'noopener,noreferrer')}
                          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm">LinkedIn</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Finance Operations?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our team is ready to help you implement the Adaptive Intelligence Framework™ 
              and achieve 300-500% ROI with AI-powered ERP solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/assessment"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Start Free Assessment
              </a>
              <a
                href="/contact"
                className="border-2 border-white bg-transparent text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Book Strategy Session
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;

