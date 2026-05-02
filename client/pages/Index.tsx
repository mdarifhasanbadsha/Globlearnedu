import Header from "../components/Header";
import { GraduationCap, Building, Users, FileText, CreditCard, ChevronRight, MapPin, Phone, Mail, Star, ArrowRight, MessageCircle, ChevronDown, Calculator, FileSearch, DollarSign, Calendar, Search, Menu, X, Globe, Award, BookOpen, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

// Sidebar Dropdown Component
const SidebarDropdownItem = ({ title, items, isOpen, onToggle }: {
  title: string;
  items: string[];
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <span className="font-medium text-gray-900">{title}</span>
      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="bg-gray-50">
        {items.map((item, index) => (
          <a
            key={index}
            href="#"
            className="block px-8 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-white transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
    )}
  </div>
);

export default function Index() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('home');
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      setShowSidebar(heroBottom < 100);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Floating Sidebar - EXACT Foreign Jao Style */}
      {showSidebar && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 max-h-[80vh] overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
            <h3 className="font-bold text-lg">Quick Navigation</h3>
            <p className="text-purple-100 text-sm">Find what you're looking for</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <SidebarDropdownItem
              title="Study Destinations"
              items={["United States", "United Kingdom", "Canada", "Australia", "Germany", "New Zealand", "Ireland", "Singapore"]}
              isOpen={openDropdown === 'destinations'}
              onToggle={() => toggleDropdown('destinations')}
            />
            <SidebarDropdownItem
              title="Universities"
              items={["Top Ranked Universities", "Ivy League Schools", "Public Universities", "Private Universities", "Community Colleges"]}
              isOpen={openDropdown === 'universities'}
              onToggle={() => toggleDropdown('universities')}
            />
            <SidebarDropdownItem
              title="Programs"
              items={["Engineering", "Business", "Computer Science", "Medicine", "Arts & Humanities", "Social Sciences"]}
              isOpen={openDropdown === 'programs'}
              onToggle={() => toggleDropdown('programs')}
            />
            <SidebarDropdownItem
              title="Services"
              items={["University Selection", "Application Assistance", "Visa Guidance", "Scholarship Help", "Test Preparation"]}
              isOpen={openDropdown === 'services'}
              onToggle={() => toggleDropdown('services')}
            />
            <SidebarDropdownItem
              title="Resources"
              items={["Study Guides", "Scholarship Database", "University Comparison", "Cost Calculator", "Visa Requirements"]}
              isOpen={openDropdown === 'resources'}
              onToggle={() => toggleDropdown('resources')}
            />
          </div>
          
          <div className="p-4 bg-gray-50 border-t">
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold">
              Book Free Consultation
            </button>
          </div>
        </div>
      )}

      {/* Hero Section - EXACT Foreign Jao "We Give You Wings" */}
      <section id="home" className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-repeat bg-pattern"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Star className="w-4 h-4 mr-2" />
                Trusted by 50,000+ Students
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                We Give You 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                  Wings
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your dreams into reality with expert guidance for studying abroad. 
                From university selection to visa success, we're your trusted partner in international education.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl hover:bg-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl">
                  Start Your Journey
                </button>
                <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all duration-300 font-bold text-lg">
                  Explore Universities
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-sm text-gray-600">Students Guided</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-gray-600">Visa Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Partner Universities</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Students studying abroad"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-70"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-70"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Section - EXACT Foreign Jao Layout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Study in Your Dream Destination
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore top study destinations worldwide and find the perfect match for your academic goals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-16">
            {[
              { name: "USA", flag: "🇺🇸", universities: "4,000+" },
              { name: "UK", flag: "🇬🇧", universities: "150+" },
              { name: "Canada", flag: "🇨🇦", universities: "200+" },
              { name: "Australia", flag: "🇦🇺", universities: "40+" },
              { name: "Germany", flag: "🇩🇪", universities: "400+" },
              { name: "France", flag: "🇫🇷", universities: "80+" },
              { name: "Netherlands", flag: "🇳🇱", universities: "14+" },
              { name: "New Zealand", flag: "🇳🇿", universities: "8+" }
            ].map((country, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-4xl group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  {country.flag}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{country.name}</h3>
                <p className="text-sm text-gray-500">{country.universities} Universities</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Universities Section - EXACT Foreign Jao with Images */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Top Universities Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore prestigious institutions where our students have successfully gained admission.
            </p>
            
            {/* Filter tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["All", "USA", "UK", "Canada", "Australia"].map((filter, index) => (
                <button key={index} className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  index === 0 ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                }`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Harvard University",
                location: "Cambridge, USA",
                ranking: "#1 World Ranking",
                image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
                acceptanceRate: "5%",
                avgSalary: "$120,000",
                programs: ["Business", "Law", "Medicine", "Engineering"]
              },
              {
                name: "Stanford University",
                location: "California, USA",
                ranking: "#2 World Ranking",
                image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
                acceptanceRate: "4%",
                avgSalary: "$125,000",
                programs: ["Computer Science", "Engineering", "Business", "Medicine"]
              },
              {
                name: "University of Oxford",
                location: "Oxford, UK",
                ranking: "#3 World Ranking",
                image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
                acceptanceRate: "17%",
                avgSalary: "$95,000",
                programs: ["Liberal Arts", "Sciences", "Engineering", "Law"]
              },
              {
                name: "University of Toronto",
                location: "Toronto, Canada",
                ranking: "#25 World Ranking",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
                acceptanceRate: "43%",
                avgSalary: "$75,000",
                programs: ["Engineering", "Business", "Medicine", "Computer Science"]
              },
              {
                name: "University of Melbourne",
                location: "Melbourne, Australia",
                ranking: "#37 World Ranking",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
                acceptanceRate: "70%",
                avgSalary: "$65,000",
                programs: ["Arts", "Sciences", "Engineering", "Business"]
              },
              {
                name: "ETH Zurich",
                location: "Zurich, Switzerland",
                ranking: "#8 World Ranking",
                image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
                acceptanceRate: "8%",
                avgSalary: "$90,000",
                programs: ["Engineering", "Computer Science", "Sciences", "Architecture"]
              }
            ].map((university, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img 
                    src={university.image} 
                    alt={university.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {university.ranking}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{university.name}</h3>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {university.location}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Acceptance Rate</span>
                      <div className="font-semibold text-purple-600">{university.acceptanceRate}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Salary</span>
                      <div className="font-semibold text-green-600">{university.avgSalary}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-gray-500 text-sm">Popular Programs</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {university.programs.slice(0, 3).map((program, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl hover:bg-purple-700 transition-colors font-bold text-lg">
              View All Universities
            </button>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from students who achieved their study abroad dreams with our guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                university: "Stanford University",
                program: "MS Computer Science",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                quote: "Foreign Jaoo made my dream of studying at Stanford a reality. Their guidance was invaluable throughout the application process.",
                achievement: "100% Scholarship"
              },
              {
                name: "Rahul Gupta",
                university: "University of Oxford",
                program: "MBA",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                quote: "The personalized attention and expert advice helped me secure admission to Oxford with a substantial scholarship.",
                achievement: "80% Scholarship"
              },
              {
                name: "Ananya Patel",
                university: "University of Toronto",
                program: "PhD Engineering",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                quote: "From university selection to visa approval, Foreign Jaoo supported me at every step. Highly recommended!",
                achievement: "Research Assistantship"
              }
            ].map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
                <div className="flex items-center mb-6">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{story.name}</h3>
                    <p className="text-purple-600 font-semibold">{story.university}</p>
                    <p className="text-gray-600 text-sm">{story.program}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{story.quote}"</p>
                
                <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block">
                  {story.achievement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Consultants Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Expert Consultants
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced team of education consultants will guide you through every step of your study abroad journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Rajesh Kumar",
                title: "Senior Education Consultant",
                experience: "15+ Years Experience",
                specialization: "US & Canada",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                students: "2000+ Students Guided",
                rating: "4.9"
              },
              {
                name: "Ms. Priya Singh",
                title: "UK & Europe Specialist",
                experience: "12+ Years Experience",
                specialization: "UK & Europe",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                students: "1500+ Students Guided",
                rating: "4.8"
              },
              {
                name: "Mr. Arjun Mehta",
                title: "Australia & NZ Expert",
                experience: "10+ Years Experience",
                specialization: "Australia & New Zealand",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                students: "1200+ Students Guided",
                rating: "4.9"
              },
              {
                name: "Dr. Sneha Patel",
                title: "Scholarship Specialist",
                experience: "8+ Years Experience",
                specialization: "Scholarships & Funding",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                students: "800+ Students Guided",
                rating: "4.7"
              }
            ].map((consultant, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img 
                    src={consultant.image} 
                    alt={consultant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    {consultant.rating}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{consultant.name}</h3>
                  <p className="text-purple-600 font-semibold mb-2">{consultant.title}</p>
                  <p className="text-gray-600 text-sm mb-3">{consultant.experience}</p>
                  
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block">
                    {consultant.specialization}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{consultant.students}</p>
                  
                  <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold">
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Abroad Tools Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Tools for Your Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Use our comprehensive tools to research, plan, and track your study abroad application process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "University Finder",
                description: "Find the perfect university based on your preferences, budget, and academic profile.",
                icon: <Search className="w-8 h-8" />,
                color: "purple",
                link: "#"
              },
              {
                title: "Cost Calculator",
                description: "Calculate the total cost of studying abroad including tuition, living expenses, and more.",
                icon: <Calculator className="w-8 h-8" />,
                color: "blue",
                link: "#"
              },
              {
                title: "Document Checker",
                description: "Ensure you have all required documents for your university and visa applications.",
                icon: <FileSearch className="w-8 h-8" />,
                color: "green",
                link: "#"
              },
              {
                title: "Scholarship Search",
                description: "Discover scholarships and funding opportunities available for international students.",
                icon: <DollarSign className="w-8 h-8" />,
                color: "orange",
                link: "#"
              }
            ].map((tool, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className={`w-16 h-16 bg-${tool.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={`text-${tool.color}-600`}>
                    {tool.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{tool.title}</h3>
                <p className="text-gray-600 mb-6">{tool.description}</p>
                
                <button className={`w-full bg-${tool.color}-600 text-white py-3 rounded-xl hover:bg-${tool.color}-700 transition-colors font-semibold`}>
                  Try Now
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <div className="bg-purple-600 text-white rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
              <p className="mb-4">Our experts can provide personalized guidance tailored to your specific situation.</p>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors font-semibold">
                Book a consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              From Our Blog
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Expert advice, student stories, and essential guides to help you make informed decisions
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["All", "Destinations", "Application Tips", "Student Stories", "Visa Guides"].map((category, index) => (
                <button key={index} className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  index === 0 ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                }`}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Top 10 Universities in the US for Indian Students in 2024",
                description: "Discover the best universities in the United States for Indian students, considering factors like programs, scholarships, ROI, and Indian student communities.",
                author: "Priya Sharma",
                authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                date: "May 12, 2024",
                category: "Destinations",
                readTime: "10 min read",
                image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80"
              },
              {
                title: "How to Write a Standout SOP for Top Universities",
                description: "Learn the secrets to crafting a compelling Statement of Purpose that will make your application stand out from the competition.",
                author: "Vikram Singh",
                authorImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                date: "Apr 28, 2024",
                category: "Application Tips",
                readTime: "7 min read",
                image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80"
              },
              {
                title: "UK Student Visa Guide: Tips for a Successful Application",
                description: "Everything you need to know about the UK student visa process, requirements, and common mistakes to avoid.",
                author: "Anjali Mehra",
                authorImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
                date: "Apr 15, 2024",
                category: "Visa Guides", 
                readTime: "5 min read",
                image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80"
              }
            ].map((article, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {article.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {article.readTime}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={article.authorImage} 
                      alt={article.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{article.author}</div>
                      <div className="text-gray-500 text-xs">{article.date}</div>
                    </div>
                  </div>
                  
                  <button className="text-purple-600 font-semibold hover:underline">
                    Read Article →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl hover:bg-purple-700 transition-colors font-bold text-lg">
              View All Articles
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Begin Your International Education Journey?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of students who have successfully realized their study abroad dreams with Foreign Jaoo's expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl hover:bg-purple-700 transition-colors font-bold text-lg">
                Book a Free Consultation
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-gray-900 transition-colors font-bold text-lg">
                Explore Our Tools
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="text-3xl font-bold text-white mb-6">Foreign Jaoo</div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Your trusted partner for study abroad guidance, helping Indian students achieve their international education dreams.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <span className="text-sm font-bold">yt</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-6">Study Destinations</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">United States</a></li>
                <li><a href="#" className="hover:text-white transition-colors">United Kingdom</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Canada</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Australia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Germany</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Zealand</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-6">Subscribe</h4>
              <p className="text-gray-300 mb-4">Stay updated with our latest news and offers</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-l-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 px-6 py-3 rounded-r-xl hover:bg-purple-700 transition-colors font-semibold">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">By subscribing, you agree to our Privacy Policy</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© 2025 Foreign Jaoo. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookies Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
