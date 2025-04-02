"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface JobDetails {
  title: string;
  description: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  contract_time?: string;
  created: string;
}

const JobPage = () => {
  const router = useRouter();
  const { country, id } = useParams();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log(`Fetching job details for ${country}/${id}`);
        
        const response = await fetch(`/api/adzuna/${country}/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.error || 'Job not found');
        }
        
        const data = await response.json();
        console.log('Job data received:', data);
        
        setJob(data);
      } catch (err) {
        console.error('Error loading job details:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (country && id) {
      fetchJob();
    }
  }, [country, id]);

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {job && (
        <>
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Company</h2>
              <p>{job.company.display_name}</p>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p>{job.location.display_name}</p>
            </div>

            {job.salary_min && job.salary_max && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Salary</h2>
                <p>£{job.salary_min} - £{job.salary_max}</p>
              </div>
            )}

            {job.contract_time && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Contract Type</h2>
                <p>{job.contract_time}</p>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Posted</h2>
              <p>{new Date(job.created).toLocaleDateString()}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Back to Jobs
              </button>
              <a
                href={job.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0057ff] hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Apply Now
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobPage;