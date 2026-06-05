import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageShell from './layout/PublicPageShell';
import { useAuth } from '../contexts/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { isStaffEmail, isStudentEmail, parseStudentEmail } from '../lib/parseStudentEmail';
import { STAFF_DIVISIONS } from '../lib/staffDivisions';

const DEPARTMENTS = ['BA', 'CE', 'CHE', 'CPE', 'DE', 'EE', 'IE', 'ME'];

const SignupPage = () => {
  const navigate = useNavigate();
  const { user, userRole, studentId, profileComplete, refreshProfile, authError } = useAuth();

  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [division, setDivision] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const isStaffSignup = isStaffEmail(user?.email);
  const isStudentSignup = isStudentEmail(user?.email);

  useEffect(() => {
    if (userRole === 'Admin') {
      navigate('/admin', { replace: true });
      return;
    }

    if (userRole === 'Staff' && profileComplete) {
      navigate('/admin', { replace: true });
      return;
    }

    if (userRole === 'Student' && profileComplete) {
      navigate('/portal', { replace: true });
    }
  }, [userRole, profileComplete, navigate]);

  const handleStudentSubmit = async (event) => {
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

  const handleStaffSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!division) {
      setError('Division is required.');
      setLoading(false);
      return;
    }

    if (!isStaffEmail(user?.email)) {
      setError('Your Google account is not a valid staff email.');
      setLoading(false);
      return;
    }

    try {
      const { error: rpcError } = await supabase.rpc('complete_staff_profile', {
        p_division: division,
      });

      if (rpcError) {
        throw rpcError;
      }

      await refreshProfile(user);
      setSuccess('Profile completed! Redirecting to the admin dashboard...');
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!isStaffSignup && !isStudentSignup) {
    return (
      <PublicPageShell page="signup">
        <div className="w-full max-w-3xl rounded-xl border border-border bg-card p-8 shadow-md">
          <p className="text-center text-destructive" role="alert">
            This signup page is only for SIIT student or staff Google accounts.
          </p>
        </div>
      </PublicPageShell>
    );
  }

  return (
    <PublicPageShell page="signup">
      <div className="w-full max-w-3xl rounded-xl border border-border bg-card p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          {isStaffSignup
            ? `Signed in as staff (${user?.email}). Select your division to manage complaints.`
            : `Signed in as student ${studentId || parsedStudentLabel(user?.email)}. Confirm your year and department to continue.`}
        </p>

        {isStaffSignup ? (
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                Division
              </label>
              <select
                id="division"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="" disabled>
                  Select your division
                </option>
                {STAFF_DIVISIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {(error || authError) && (
              <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm font-medium text-red-700" role="alert">
                {error || authError}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-300 bg-green-100 p-3 text-sm font-medium text-green-700" role="status">
                {success}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg border border-transparent bg-siit-purple px-4 py-2 text-lg font-medium text-white shadow-md transition duration-300 ease-in-out hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save and Continue'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="" disabled>
                  Select your year
                </option>
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
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="" disabled>
                  Select your department
                </option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {(error || authError) && (
              <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm font-medium text-red-700" role="alert">
                {error || authError}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-300 bg-green-100 p-3 text-sm font-medium text-green-700" role="status">
                {success}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg border border-transparent bg-siit-purple px-4 py-2 text-lg font-medium text-white shadow-md transition duration-300 ease-in-out hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save and Continue'}
              </button>
            </div>
          </form>
        )}
      </div>
    </PublicPageShell>
  );
};

function parsedStudentLabel(email) {
  const parsed = parseStudentEmail(email);
  return parsed?.studentId || 'account';
}

export default SignupPage;
