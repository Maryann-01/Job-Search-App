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
      className="relative bg-cover bg-center h-[500px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center"
      style={{ backgroundImage: "url('/images/hero_img.jpg')" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-xl text-black">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Find Your Dream Job</h1>
          <p className="mt-2 text-base sm:text-lg">
            Browse thousands of job listings from top companies.
          </p>

          <h2 className="mt-6 text-lg font-semibold">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-10 gap-y-5 mt-2 ">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => router.push(`/jobs?category=${category.toLowerCase()}`)}
             className="bg-white text-[#0057ff] px-4 py-2 rounded-lg shadow-md text-sm transition-colors duration-300 hover:bg-[#0057ff] hover:text-white w-full sm:w-auto min-w-[120px]"
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
