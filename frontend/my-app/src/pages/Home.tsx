import { Button } from "../components/ui/Button";
import { Search, Users, Briefcase, Target, CheckCircle  } from "lucide-react";

const Home = () => {
   const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "2,500+" },
    { icon: Users, label: "Companies", value: "500+" },
    { icon: Target, label: "Successful Hires", value: "10,000+" },
    { icon: CheckCircle, label: "Success Rate", value: "95%" },
  ];
  return (
    <>
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
        <p className="text-white text-center mt-4 text-sm mb-10">
          Popular Searches: Software Engineer, Data Scientist, Product Manager, Designer
        </p>
    </div>  
    <section className="p-5">
        <div className=" mx-auto px-2 sm:px-6 lg:px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="inline-flex p-2 rounded-full bg-blue-100">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  
  );
};

export default Home;
