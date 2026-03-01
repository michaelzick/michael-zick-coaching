
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-8 w-8 text-learnify-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-learnify-600 to-learnify-800 bg-clip-text text-transparent">
                Learnify
              </span>
            </Link>
            <p className="text-gray-600 mb-6">
              Expand your knowledge with expert-led online courses. Learn at your own pace and unlock your potential.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-learnify-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-learnify-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-learnify-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-learnify-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/courses" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/category/development" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  Development
                </Link>
              </li>
              <li>
                <Link to="/category/business" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/category/design" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  Design
                </Link>
              </li>
              <li>
                <Link to="/category/marketing" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  Marketing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Information</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-learnify-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <p className="text-gray-600 mb-4">Have a question or feedback? Reach out to our team.</p>
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-5 w-5 text-learnify-600" />
              <span className="text-gray-600">support@learnify.com</span>
            </div>
            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Subscribe to our newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 rounded-l-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-learnify-600 focus:border-transparent"
                />
                <button className="bg-learnify-600 hover:bg-learnify-700 text-white py-2 px-4 rounded-r-md text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-gray-500 text-center text-sm">
            © {new Date().getFullYear()} Learnify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
