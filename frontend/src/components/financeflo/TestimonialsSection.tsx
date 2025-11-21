import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  industry: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ronel Mostert",
    role: "Financial Group Manager",
    company: "Afritelecoms (PTY) LTD",
    content: "I have been using FinanceFlo.ai to implement/support Sage Evolution and have always been satisfied with their performance. They are very professional, go the extra mile and always take the time to listen and adhere to all our needs/requests. Not only do they tend to our technical support/implementation queries but also include admin duties with 3rd party software on our behalf at no cost to us. They have a continuous technical expertise support approach that's delivered and has continuously been satisfactory.",
    rating: 5,
    industry: "Telecommunications"
  },
  {
    id: 2,
    name: "Mary Erdoes",
    role: "CEO Asset & Wealth Management",
    company: "JPMorgan Chase",
    content: "When you have a tool that pre-populates all the data and the movement in real time, while also remembering clients' old investment preferences and helps in tailoring a plan for them quickly, it also allows advisers to do much more. Our AI-powered ERP integration has delivered 20% revenue growth and $1.5 billion in savings.",
    rating: 5,
    industry: "Financial Services"
  },
  {
    id: 3,
    name: "Amy Lenander",
    role: "Chief Data Officer",
    company: "Capital One",
    content: "Data, machine learning and AI are central components of how we operate and serve our customers. Today we are embedding AI throughout our business with proprietary solutions built on our modern tech stack. We've achieved 90% cost savings and 50% faster resolution times through AI-powered ERP integration.",
    rating: 5,
    industry: "Digital Banking"
  },
  {
    id: 4,
    name: "Caron Lloyd",
    role: "Operations Manager",
    company: "EnergyDrive Systems (PTY) LTD",
    content: "We have engaged FinanceFlo.ai to support our Sage software package and have consistently been satisfied with the level of service provided. The team is professional, responsive, and always willing to go the extra mile. They take the time to understand our specific needs and ensure these are met with care and attention. Not only do they tend to our technical support queries but also include admin duties with 3rd party software on our behalf at no extra cost to us. Their ongoing, hands-on approach to technical support has proven reliable and effective.",
    rating: 5,
    industry: "Energy Systems"
  },
  {
    id: 5,
    name: "Rob Garf",
    role: "VP and General Manager",
    company: "Salesforce Retail",
    content: "When deploying AI, whether you focus on top-line growth or bottom-line profitability, start with the customer and work backward. The integration of AI with ERP systems creates unprecedented opportunities for revenue growth and operational efficiency.",
    rating: 5,
    industry: "Technology"
  },
  {
    id: 6,
    name: "Mrs. Dawn Bell",
    role: "Public Officer",
    company: "Diccorv Properties (PTY) LTD",
    content: "FinanceFlo.ai have assisted me with implementation and support on Evolution and I have always been satisfied with their performance. They do an excellent job, are always punctual, and offer the most competitive rates in town. Their technicians are knowledgeable and have been able to solve any issues I've had on Evolution. They check regularly to ensure that things are running smoothly.",
    rating: 5,
    industry: "Property Management"
  },
  {
    id: 6,
    name: "Audrey Albertyn",
    role: "HRP Manager",
    company: "TMF Group",
    content: "I have been using FinanceFlo.ai to implement and support 300 People and have always been satisfied with their performance. They do an excellent job, are always punctual, and are willing to provide creative solutions to everyday business challenges. They have a continuous technical expertise support approach that's delivered and has continuously been satisfactory.",
    rating: 5,
    industry: "Corporate Services"
  },
  {
    id: 7,
    name: "Rob Garf",
    role: "VP and General Manager",
    company: "Salesforce Retail",
    content: "When deploying AI, whether you focus on top-line growth or bottom-line profitability, start with the customer and work backward. The integration of AI with ERP systems creates unprecedented opportunities for revenue growth and operational efficiency.",
    rating: 5,
    industry: "Technology"
  },
  {
    id: 8,
    name: "Mike Urciuoli",
    role: "Chief Information Officer",
    company: "JPMorgan Chase",
    content: "Our advisers are finding the right information up to 95% faster - which means they spend less time searching and more time engaging in meaningful conversations with clients. AI-powered ERP integration has transformed our operational efficiency.",
    rating: 5,
    industry: "Financial Services"
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Discover how businesses across industries have transformed their 
            operations and achieved remarkable results with FinanceFlo.ai.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    nextTestimonial();
                  } else if (swipe > swipeConfidenceThreshold) {
                    prevTestimonial();
                  }
                }}
                className="p-8 md:p-12"
              >
                <div className="text-center">
                  <Quote className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                  
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-lg md:text-xl text-slate-700 mb-8 leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-slate-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-blue-600 font-medium">
                        {testimonials[currentIndex].role}
                      </p>
                      <p className="text-slate-600">
                        {testimonials[currentIndex].company} • {testimonials[currentIndex].industry}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-slate-50 transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-slate-50 transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

