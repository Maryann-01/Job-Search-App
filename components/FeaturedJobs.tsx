"use client";
import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  location: { display_name: string };
  redirect_url: string;
}

interface Category {
  label: string;
  tag: string;
}

const FeaturedJobs = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("gb");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const countries = [
    { code: "gb", name: "UK" },
    { code: "us", name: "USA" },
    { code: "ca", name: "Canada" },
    { code: "au", name: "Australia" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const appId = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
        const appKey = process.env.NEXT_PUBLIC_ADZUNA_APP_KEY;
        const response = await fetch(
          `https://api.adzuna.com/v1/api/jobs/${selectedCountry}/categories?app_id=${appId}&app_key=${appKey}`
        );
        const data = await response.json();
        setCategories(data.results || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [selectedCountry]);

  
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const appId = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
      const appKey = process.env.NEXT_PUBLIC_ADZUNA_APP_KEY;
      const categoryParam = selectedCategory ? `&category=${selectedCategory}` : "";
      
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/${selectedCountry}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20${categoryParam}`
      );
      const data = await response.json();
      
      if (data.results) {
        setJobs(data.results);
        setError("");
      } else {
        setError("No jobs found.");
      }
    } catch (err) {
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCountry]);

  const handleJobDetails = (jobId: string) => {
    router.push(`/jobs/${selectedCountry}/${jobId}`);
  };

  return (
    <section className="py-8 px-4 bg-white">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#0057ff] mb-8">
          Featured Jobs
        </h1>

        <div className="mb-8 flex flex-wrap items-center justify-end gap-4">
          <div> 
           <h1 className="text-2xl font-bold text-center text-[#0057ff] ">Filter By:</h1>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowCountryDropdown((prev) => !prev)}
              className="flex items-center justify-between text-[#0057ff] hover:text-blue-700 transition-colors border border-gray-300 px-3 py-2 rounded"
            >
              <span>
                {countries.find(c => c.code === selectedCountry)?.name}
              </span>
              <FaFilter />
            </button>
            {showCountryDropdown && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-20">
                {countries.map(country => (
                  <div
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country.code);
                      setShowCountryDropdown(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown((prev) => !prev)}
              className="flex items-center justify-between text-[#0057ff] hover:text-blue-700 transition-colors border border-gray-300 px-3 py-2 rounded"
            >
              <span>
                {selectedCategory
                  ? categories.find(cat => cat.tag === selectedCategory)?.label
                  : "Job Title"}
              </span>
              <FaFilter />
            </button>
            {showCategoryDropdown && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-20 max-h-60 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search category..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full p-2 border-b border-gray-200 focus:outline-none"
                />
                {categories
                  .filter(cat =>
                    cat.label.toLowerCase().includes(categorySearch.toLowerCase())
                  )
                  .map(cat => (
                    <div
                      key={cat.tag}
                      onClick={() => {
                        setSelectedCategory(cat.tag);
                        setShowCategoryDropdown(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {cat.label}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center">Loading jobs...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : jobs.length > 0 ? (
            jobs.map(job => (
              <div
                key={job.id}
                className="bg-gray-50 p-4 rounded shadow hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="font-semibold text-[#0057ff] text-lg">
                  {job.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {countries.find(c => c.code === selectedCountry)?.name}
                </p>
                <button
                  onClick={() => handleJobDetails(job.id)}
                  className="mt-2 inline-block text-blue-600 hover:underline"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-center">No jobs available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;