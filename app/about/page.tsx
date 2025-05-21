"use client";
import { FaSearch, FaFilter, FaLock, FaBell, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const AboutPage = () => {
    const { user, loading } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-[#0057ff] to-blue-600 text-white py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">About JobSearcher</h1>
                    <p className="text-xl md:text-2xl text-blue-100">
                        Your Direct Path to Quality Job Opportunities
                    </p>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-16">
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <div className="text-blue-600 mb-4">
                                <FaSearch className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Search & Filter</h3>
                            <p className="text-gray-600">
                                Use our advanced filters to find jobs by location, salary range,
                                and contract type. Save your favorite searches for quick access.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <div className="text-blue-600 mb-4">
                                <FaLock className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. Secure Login</h3>
                            <p className="text-gray-600">
                                Create a free account to view full job details and application links.
                                We protect your data with industry-standard security.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <div className="text-blue-600 mb-4">
                                <FaBell className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Apply Directly</h3>
                            <p className="text-gray-600">
                                Once logged in, access detailed job descriptions and apply through
                                our platform. Track your applications in one place.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="mb-20">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2 order-2 md:order-1">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Smart Filtering</h2>
                            <p className="text-gray-600 mb-4">
                                Our powerful filtering system lets you narrow down opportunities by:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Location preferences</li>
                                <li>Salary range (minimum to maximum)</li>
                                <li>Contract type (full-time, part-time, contract)</li>
                                <li>Company size</li>
                                <li>Date posted</li>
                            </ul>
                        </div>
                        <div className="md:w-1/2 order-1 md:order-2">
                            <div className="bg-blue-100 p-8 rounded-xl">
                                <FaFilter className="w-24 h-24 text-blue-600 mx-auto" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Story</h2>
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Founded in 2025 by job seekers for job seekers, JobSearcher was born from
                            a simple idea: everyone deserves straightforward access to quality job
                            opportunities without complicated algorithms or hidden requirements.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed mt-4">
                            We noticed many platforms made it hard to find basic information before
                            signing up. That&apos;s why we built a transparent system where you can browse
                            listings freely, but protect employer connections behind a secure login -
                            ensuring serious applicants and quality opportunities.
                        </p>
                    </div>
                </section>

                <section className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Ready to Find Your Next Opportunity?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join our growing community of job seekers and employers who value transparency
                        and quality connections
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/#featured-jobs"
                            className="bg-[#0057ff] text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold cursor-pointer"
                        >
                            Browse Jobs
                        </Link>
                        
                        {loading ? (
                            <div className="border-2 border-[#0057ff] text-[#0057ff] px-8 py-4 rounded-lg text-lg font-semibold">
                                Loading...
                            </div>
                        ) : user ? (
                            <div className="border-2 border-[#0057ff] bg-blue-50 text-[#0057ff] px-8 py-4 rounded-lg flex items-center gap-2 text-lg font-semibold">
                                <FaUser className="inline" />
                                <Link href="/">
                                    Back to Landing Page
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="border-2 border-[#0057ff] text-[#0057ff] px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold cursor-pointer"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;