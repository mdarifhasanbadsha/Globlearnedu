import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Top purple bar */}
      <div className="bg-purple-600 text-white text-center py-2 text-sm">
        💬 Limited 1:1 slots left this week
      </div>
      
      {/* Main navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">Foreign Jao</div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-purple-600 font-medium hover:text-purple-500 transition-colors">
                Home
              </a>
              <a href="#why-us" className="text-gray-600 hover:text-purple-600 transition-colors">
                Why Us
              </a>
              <a href="#faqs" className="text-gray-600 hover:text-purple-600 transition-colors">
                FAQs
              </a>
              <a href="#contact" className="text-gray-600 hover:text-purple-600 transition-colors">
                Contact Us
              </a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm">
                Book Appointment
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#home"
                className="block px-3 py-2 text-purple-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#why-us"
                className="block px-3 py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Why Us
              </a>
              <a
                href="#faqs"
                className="block px-3 py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </a>
              <div className="px-3 py-2">
                <button className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
