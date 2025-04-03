"use client";
import { useState } from 'react';
import { FiMail, FiUser, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.message.length < 10) {
      setError('Message should be at least 10 characters');
      return;
    }
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0057ff] mb-2">Contact Us</h1>
            <p className="text-gray-600">Have questions? We're here to help!</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              <FiAlertCircle className="mr-2" />
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center p-8">
              <div className="text-green-600 text-lg mb-4">
                Message sent successfully!
              </div>
              <p className="text-gray-600">
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:border-[#0057ff] focus:ring-2 focus:ring-[#0057ff]/20 transition"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:border-[#0057ff] focus:ring-2 focus:ring-[#0057ff]/20 transition"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:border-[#0057ff] focus:ring-2 focus:ring-[#0057ff]/20 transition"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Message</label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3 top-4 text-gray-400" />
                    <textarea
                      required
                      rows={6}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:border-[#0057ff] focus:ring-2 focus:ring-[#0057ff]/20 transition resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0057ff] text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;