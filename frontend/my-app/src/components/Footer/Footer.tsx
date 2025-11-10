import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="fade-in grid grid-cols-1 md:grid-cols-4 gap-8 p-6 bg-gray-50 text-gray-700">

      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xl font-semibold mb-3">
          <Briefcase />
          <span>Hiring System</span>
        </div>
        <p>
          Connecting top talent with great opportunities. Streamline your hiring
          process with our advanced recruitment platform.
        </p>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">Quick Links</h2>
        <ul className="space-y-2">
          <li><Link to="/jobs" className="hover-underline hover:text-blue-600">Browse Jobs</Link></li>
          <li><Link to="/about" className="hover-underline hover:text-blue-600">About</Link></li>
          <li><Link to="/contact" className="hover-underline hover:text-blue-600">Contact Us</Link></li>
          <li><Link to="/careers" className="hover-underline hover:text-blue-600">Careers</Link></li>
        </ul>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">For Employers</h2>
        <ul className="space-y-2">
          <li><Link to="/post-job" className="hover-underline hover:text-blue-600">Post a Job</Link></li>
          <li><Link to="/pricing" className="hover-underline hover:text-blue-600">Pricing</Link></li>
          <li><Link to="/resources" className="hover-underline hover:text-blue-600">Resources</Link></li>
          <li><Link to="/support" className="hover-underline hover:text-blue-600">Support</Link></li>
        </ul>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">Contact Us</h2>
        <p>contact@hireflow.com</p>
        <p>+1 (555) 123-4567</p>
        <p>123 Business Ave, Suite 100</p>
      </div>

    </div>
  );
};

export default Footer;
