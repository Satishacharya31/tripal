import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mountain, User, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      fetchUser().then(() => {
        window.history.replaceState({}, document.title, '/');
        navigate('/dashboard');
      });
    } else if (params.get('google') === 'success') {
      setIsLoading(true);
      fetchUser().then(() => {
        navigate('/dashboard');
      });
    }
  }, [navigate, fetchUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    setResetToken('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await response.json();
      if (response.ok) {
        setResetToken(data.resetToken);
        setResetMessage('Reset token generated. Use it to set a new password.');
      } else {
        setResetMessage(data.message || 'Error requesting reset');
      }
    } catch (err) {
      setResetMessage('Error requesting reset');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Mountain className="h-12 w-12 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">Nepal Guide Connect</h1>
            </div>
            <p className="text-gray-600">Welcome back to your Nepal adventure</p>
          </div>

          {/* Regular Login Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Login with Credentials</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <a
                href="http://localhost:5000/api/auth/google"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25C22.56 11.42 22.49 10.62 22.36 9.84H12.27V14.4H18.16C17.86 16.08 17.03 17.54 15.69 18.46V21.09H19.6C21.56 19.23 22.56 16.08 22.56 12.25Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.27 23C15.11 23 17.51 22.09 19.12 20.64L15.69 18.46C14.76 19.04 13.6 19.36 12.27 19.36C9.86 19.36 7.8 17.83 7.03 15.61H3.09V18.24C4.71 21.11 8.19 23 12.27 23Z"
                    fill="#34A853"
                  />
                  <path
                    d="M7.03 15.61C6.77 14.88 6.63 14.08 6.63 13.25C6.63 12.42 6.77 11.62 7.03 10.89V8.26H3.09C2.39 9.73 2 11.42 2 13.25C2 15.08 2.39 16.77 3.09 18.24L7.03 15.61Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.27 6.64C13.74 6.64 15.03 7.13 16.03 8.05L19.16 4.92C17.51 3.36 15.11 2.5 12.27 2.5C8.19 2.5 4.71 4.89 3.09 8.26L7.03 10.89C7.8 8.67 9.86 6.64 12.27 6.64Z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </a>
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400">Or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={() => setShowReset(!showReset)}
              >
                Forgot Password?
              </button>
            </div>
            {showReset && (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-2">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Request Reset</button>
                {resetMessage && <div className="text-sm text-green-600 mt-2">{resetMessage}</div>}
                {resetToken && (
                  <div className="text-xs text-gray-500 break-all mt-2">
                    Reset Token: {resetToken}
                  </div>
                )}
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
