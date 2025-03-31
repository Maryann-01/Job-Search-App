"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://api.adzuna.com/v1/api/jobs/gb/categories?app_id=${process.env.NEXT_PUBLIC_ADZUNA_APP_ID}&app_key=${process.env.NEXT_PUBLIC_ADZUNA_APP_KEY}`
        );
        const data = await response.json();
        
        console.log("Fetched categories:", data);


        if (data.results) {
          // Extract category names, remove "Jobs" from labels, and get top 10
          const topCategories = data.results
            .map((cat: { label: string }) => cat.label.replace(" Jobs", ""))
            .slice(0, 10);
          setCategories(topCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
    if (query) router.push(`/jobs?search=${query}`);
  };

  return (
    <section
      className="relative bg-cover bg-center h-[500px] flex items-center "
      style={{ backgroundImage: "url('/images/hero_img.jpg')" }}
    >
      <div className="container mx-auto px-4">
        {/* Hero Content */}
        <div className="max-w-xl text-black">
          <h1 className="text-4xl font-bold">Find Your Dream Job</h1>
          <p className="mt-2 text-lg">Browse thousands of job listings from top companies.</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-4 flex bg-white p-2 rounded-lg shadow-md">
            <input
              type="text"
              name="search"
              placeholder="Search jobs..."
              className="flex-grow p-2 text-gray-700 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {/* Popular Categories */}
          <h2 className="mt-6 text-lg font-semibold">Popular Categories</h2>
          <div className="grid grid-cols-5 gap-4 mt-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => router.push(`/jobs?category=${category.toLowerCase()}`)}
                className="bg-white text-gray-800 p-2 rounded-lg shadow-md text-sm hover:bg-gray-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
