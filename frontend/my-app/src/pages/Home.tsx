import { Button } from "../components/ui/Button";
import { Search } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-blue-600 p-4">
      <h1 className="text-4xl font-bold text-white text-center mt-10">
        Find Your Dream Jobs <br />
        <span className="text-blue-800">Today</span>
      </h1>
      <p className="text-white text-center mt-4 max-w-xl">
        Connect with top employers and discover opportunities that <br />
        <span>match your skills and aspirations.</span>
      </p>

      <div className="max-w-lg w-full mx-auto bg-white backdrop-blur-sm rounded-lg p-1 mt-6 shadow-lg">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-5 text-gray-400" />
            <input
              type="text"
              id="search"
              placeholder="Search for jobs, companies, or keywords"
              className="w-full p-1.5 rounded-lg pl-10 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <Button size="lg" className="px-6 bg-blue-600 text-white hover:bg-blue-700">
            Search Jobs
          </Button> 
        </div>
      </div>
    </div>  
  );
};

export default Home;
