import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  // Basic Information
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  
  // Academic Details
  const [branch, setBranch] = useState('');
  const [batchYear, setBatchYear] = useState('');
  
  // Contact Information
  const [mobileNumber, setMobileNumber] = useState('');
  
  // Profile Customization
  const [interests, setInterests] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    allowChat: true,
    allowGroupAdd: true,
    showMobileNumber: false
  });
  
  const [loading, setLoading] = useState(false);

  const handlePrivacyChange = (field) => (e) => {
    const newSettings = {
      ...privacySettings,
      [field]: e.target.checked
    };
    
    // If disabling chat, automatically disable group add
    if (field === 'allowChat' && !e.target.checked) {
      newSettings.allowGroupAdd = false;
    }
    
    setPrivacySettings(newSettings);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !fullName || !email || !password || !avatar || !branch || !batchYear) {
      toast.error('Please fill all required fields!');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      // Basic Information
      formData.append('username', username);
      formData.append('FullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('Avatar', avatar);
      
      // Academic Details
      formData.append('branch', branch);
      formData.append('batchYear', batchYear);
      
      // Contact Information
      formData.append('mobileNumber', mobileNumber);
      
      // Profile Content
      formData.append('interests', interests);
      formData.append('workExperience', workExperience);
      
      // Privacy Preferences
      formData.append('privacySettings', JSON.stringify(privacySettings));

      await axios.post(`${import.meta.env.VITE_backend_URL}/users/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success("Registration Successful!");  
      navigate("/login"); 

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <ToastContainer />
      <div className="w-full max-w-2xl space-y-8 p-8 bg-yellow-50 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Log in here
            </Link>
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Username and Full Name */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                id="username"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="fullName"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            {/* Branch and Batch Year */}
            <div className="space-y-2">
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                Branch *
              </label>
              <select
                id="branch"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              >
                <option value="">Select Your Branch</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="ME">Mechanical</option>
                <option value="CE">Civil</option>
                <option value="EE">Electrical</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="batchYear" className="block text-sm font-medium text-gray-700">
                Batch Year *
              </label>
              <select
                id="batchYear"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                required
              >
                <option value="">Select Passing Year</option>
                {Array.from({length: 20}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* Email and Mobile */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+91 9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                type="tel"
              />
            </div>
            
            {/* Password and Avatar */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Profile Picture *
              </label>
              <input
                type="file"
                id="avatar"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                required
              />
            </div>
          </div>
          
          {/* Interests and Work Experience */}
          <div className="space-y-2">
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
              Interests (Optional)
            </label>
            <textarea
              id="interests"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your interests, hobbies, or skills (comma separated)"
              rows="2"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700">
              Work Experience (Optional)
            </label>
            <textarea
              id="workExperience"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Briefly describe your professional experience"
              rows="3"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
            />
          </div>
          
          {/* Privacy Settings Section */}
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Privacy Settings</h3>
            
            <div className="space-y-3">
              {/* Allow Chat Option */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="allowChat"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={privacySettings.allowChat}
                    onChange={handlePrivacyChange('allowChat')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowChat" className="font-medium text-gray-700">
                    Allow others to chat with me
                  </label>
                  <p className="text-gray-500">
                    Uncheck to prevent anyone from sending you direct messages
                  </p>
                </div>
              </div>
              
              {/* Allow Group Add Option */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="allowGroupAdd"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={privacySettings.allowGroupAdd}
                    onChange={handlePrivacyChange('allowGroupAdd')}
                    disabled={!privacySettings.allowChat}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowGroupAdd" className={`font-medium ${!privacySettings.allowChat ? 'text-gray-400' : 'text-gray-700'}`}>
                    Allow others to add me to groups
                  </label>
                  <p className={`${!privacySettings.allowChat ? 'text-gray-400' : 'text-gray-500'}`}>
                    Only available if chat is enabled
                  </p>
                </div>
              </div>
              
              {/* Mobile Number Visibility */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="showMobileNumber"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={privacySettings.showMobileNumber}
                    onChange={handlePrivacyChange('showMobileNumber')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="showMobileNumber" className="font-medium text-gray-700">
                    Show my mobile number on profile
                  </label>
                  <p className="text-gray-500">
                    Only visible to users you chat with
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;