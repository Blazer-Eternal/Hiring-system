import { useEffect, useState } from "react";
import type { InputJobInterface } from "../types/InputJobInterface";

function JobsList() {
  const [jobs, setJobs] = useState<InputJobInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data: InputJobInterface[] = await res.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <>
      <div className="bg-gray-100 text-black py-6 text-center">
        <h1 className="text-4xl font-bold text-center m-2">Find Your Perfect Job</h1>
        <p>Discover opportunities that match your skills and career goals</p>
      </div>
      

      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Available Jobs</h2>
        {loading && <p>Loading jobs…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {/* ✅ Show jobs only if available */}
        {!loading && !error && jobs.length === 0 && <p>No jobs available.</p>}
        {!loading &&
          !error &&
          jobs.map((job, idx) => (
            <div key={idx} className="border p-4 rounded-xl mb-4 shadow-sm">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-700">
                {job.department} – {job.location}
              </p>
              <p className="mt-2">{job.description}</p>
              <p className="mt-1">
                <strong>Requirements:</strong> {job.requirements}
              </p>
              <p className="mt-1">
                <strong>Salary:</strong> {job.salaryRange}
              </p>
              {job.status && (
                <span className="mt-2 inline-block text-sm bg-green-200 px-2 py-1 rounded">
                  {job.status}
                </span>
              )}
            </div>
          ))}
      </div>
    </>
  );
}

export default JobsList;
