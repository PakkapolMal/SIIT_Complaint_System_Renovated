import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import { useAuth } from '../contexts/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { parseStudentEmail } from '../lib/parseStudentEmail';

const DEPARTMENTS = ['BA', 'CE', 'CHE', 'CPE', 'DE', 'EE', 'IE', 'ME'];

const SignupPage = () => {
  const navigate = useNavigate();
  const { user, userRole, studentId, profileComplete, refreshProfile, authError } = useAuth();

  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userRole && userRole !== 'Student') {
      navigate('/admin', { replace: true });
      return;
    }

    if (profileComplete) {
      navigate('/portal', { replace: true });
    }
  }, [userRole, profileComplete, navigate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!year || !department) {
      setError('Year and department are required.');
      setLoading(false);
      return;
    }

    const parsed = parseStudentEmail(user?.email);
    if (!parsed) {
      setError('Your Google account is not a valid student email.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('student')
        .update({
          Year: Number(year),
          Department: department,
        })
        .eq('UUID', user.id);

      if (updateError) {
        throw updateError;
      }

      await refreshProfile(user);
      setSuccess('Profile completed! Redirecting to your portal...');
      setTimeout(() => {
        navigate('/portal', { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-siit-light">
      <PublicHeader page="signup" />

      <main className="flex justify-center items-center flex-grow p-4 sm:p-8">
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
            Complete Your Profile
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Signed in as student {studentId || parsedStudentLabel(user?.email)}. Confirm your year and department to continue.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                required
              >
                <option value="" disabled>Select your year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                required
              >
                <option value="" disabled>Select your department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {(error || authError) && (
              <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300">
                {error || authError}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-300">
                {success}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-siit-purple hover:bg-purple-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save and Continue'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

function parsedStudentLabel(email) {
  const parsed = parseStudentEmail(email);
  return parsed?.studentId || 'account';
}

export default SignupPage;
