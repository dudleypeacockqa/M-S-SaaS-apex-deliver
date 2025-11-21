import React from 'react';
import { motion } from 'framer-motion';

interface ClientLogo {
  name: string;
  logo: string;
  industry: string;
}

const clientLogos: ClientLogo[] = [
  {
    name: "Afritelecoms",
    logo: "/assets/images/client-logos/afritel.jpg",
    industry: "Telecommunications"
  },
  {
    name: "TMF Group",
    logo: "/assets/images/client-logos/tmf-group.png",
    industry: "Corporate Services"
  },
  {
    name: "EnergyDrive Systems",
    logo: "/assets/images/client-logos/energydrive.jpg",
    industry: "Energy Systems"
  },
  {
    name: "Diccorv Properties",
    logo: "/assets/images/client-logos/diccorv.jpg",
    industry: "Property Management"
  },
  {
    name: "Salesforce",
    logo: "/assets/images/client-logos/salesforce.png",
    industry: "Technology"
  },
  {
    name: "Mouchel",
    logo: "/assets/images/client-logos/mouchel.png",
    industry: "Infrastructure & Engineering"
  }
];

const ClientLogosSection: React.FC = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join 250,000+ customers who have transformed their finance operations
            with our AI-powered ERP solutions.
          </p>
        </motion.div>

        {/* Scrolling Logo Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-logos">
            {/* First set of logos */}
            {clientLogos.map((client, index) => (
              <motion.div
                key={`first-${client.name}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 mx-8 group"
              >
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105 w-48 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width="128"
                      height="80"
                      className="w-32 h-20 object-contain mx-auto mb-2"
                      loading="lazy"
                      onError={(e) => {
                        // Secure fallback using React state instead of innerHTML
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        
                        // Create fallback element securely
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-logo')) {
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className = 'fallback-logo text-center';
                          
                          const logoBox = document.createElement('div');
                          logoBox.className = 'w-24 h-16 bg-gradient-to-br from-brand-navy/10 to-brand-gold/10 rounded-lg flex items-center justify-center mb-2 mx-auto';
                          
                          const initials = document.createElement('span');
                          initials.className = 'text-brand-navy font-bold text-lg';
                          initials.textContent = client.name.substring(0, 2).toUpperCase();
                          
                          logoBox.appendChild(initials);
                          fallbackDiv.appendChild(logoBox);
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                    <p className="text-sm font-semibold text-foreground">
                      {client.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {client.industry}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Duplicate set for seamless scrolling */}
            {clientLogos.map((client, index) => (
              <div
                key={`second-${client.name}`}
                className="flex-shrink-0 mx-8 group"
              >
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105 w-48 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width="128"
                      height="80"
                      className="w-32 h-20 object-contain mx-auto mb-2"
                      loading="lazy"
                      onError={(e) => {
                        // Secure fallback using React state instead of innerHTML
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        
                        // Create fallback element securely
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-logo')) {
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className = 'fallback-logo text-center';
                          
                          const logoBox = document.createElement('div');
                          logoBox.className = 'w-24 h-16 bg-gradient-to-br from-brand-navy/10 to-brand-gold/10 rounded-lg flex items-center justify-center mb-2 mx-auto';
                          
                          const initials = document.createElement('span');
                          initials.className = 'text-brand-navy font-bold text-lg';
                          initials.textContent = client.name.substring(0, 2).toUpperCase();
                          
                          logoBox.appendChild(initials);
                          fallbackDiv.appendChild(logoBox);
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                    <p className="text-sm font-semibold text-foreground">
                      {client.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {client.industry}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-border"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-navy mb-1">230+</div>
            <div className="text-sm text-muted-foreground">Successful Implementations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-gold mb-1">20+</div>
            <div className="text-sm text-muted-foreground">Years of Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-navy mb-1">300-500%</div>
            <div className="text-sm text-muted-foreground">Average ROI Delivered</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientLogosSection;

