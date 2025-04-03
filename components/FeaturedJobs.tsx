"use client";
import { useState, useEffect } from "react";
import { FaFilter, FaArrowLeft, FaArrowRight } from "react-icons/fa";
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const resultsPerPage = 21;

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
        `https://api.adzuna.com/v1/api/jobs/${selectedCountry}/search/${currentPage}?app_id=${appId}&app_key=${appKey}&results_per_page=${resultsPerPage}${categoryParam}`
      );
      const data = await response.json();
      
      if (data.results) {
        setJobs(data.results);
        if (data.count) {
          setTotalPages(Math.ceil(data.count / resultsPerPage));
        }
        
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
  }, [selectedCountry, selectedCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, selectedCategory]);

  const handleJobDetails = (jobId: string) => {
    router.push(`/jobs/${selectedCountry}/${jobId}`);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-[#0057ff] text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <section className="py-8 px-4 bg-white">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#0057ff] mb-8">
          Featured Jobs
        </h1>

        <div className="mb-8 flex flex-wrap items-center justify-end gap-4">
          <div> 
           <h1 className="text-2xl font-bold text-center text-[#0057ff]">Filter By:</h1>
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
            <p className="text-center col-span-3">Loading jobs...</p>
          ) : error ? (
            <p className="text-center text-red-500 col-span-3">{error}</p>
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
                  {job.location.display_name}
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
            <p className="text-center col-span-3">No jobs available</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <button 
              onClick={goToPreviousPage} 
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l flex items-center ${
                currentPage === 1 
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <FaArrowLeft className="mr-1" /> Prev
            </button>
            
            {renderPaginationNumbers()}
            
            <button 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r flex items-center ${
                currentPage === totalPages 
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Next <FaArrowRight className="ml-1" />
            </button>
          </div>
        )}
        <div className="text-center mt-2 text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;