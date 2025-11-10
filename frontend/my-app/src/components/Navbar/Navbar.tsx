import { Briefcase, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const dashboardItems = [
    { name: "User Dashboard", path: "/user-dashboard" },
    { name: "Admin Dashboard", path: "/admin-dashboard" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-90 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-white/20" : "bg-white/85"
      }`}
    >
      <div className="mx-auto px-9 sm:px-8 lg:px-8">
        <div className="flex h-10 items-center justify-between p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-black">
            <div className="p-4 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold">HireFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 pY-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-lg font-small transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {dashboardItems.map((item) => (
              <Button
                key={item.name}
                variant={isActive(item.path) ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link to={item.path}>{item.name}</Link>
              </Button>
            ))}
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {dashboardItems.map((item) => (
                  <Button
                    key={item.name}
                    variant={isActive(item.path) ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link to={item.path} onClick={() => setIsMenuOpen(false)}>
                      {item.name}
                    </Link>
                  </Button>
                ))}
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
