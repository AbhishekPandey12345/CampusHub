import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    interests: '',
    workExperience: '',
    avatar: null,
  });
  const [privacySettings, setPrivacySettings] = useState({
    allowChat: true,
    allowGroupAdd: true,
    showMobileNumber: false
  });
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const location = useLocation();
  const { userdata } = location.state || {};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = userdata.Profiledata;
        console.log(userData);
        
        setFormData({
          mobileNumber: userData.mobileNumber || '',
          interests: userData.interests || '',
          workExperience: userData.workExperience || '',
          avatar: null,
        });
        
        setPrivacySettings({
          allowChat: userData.allowChat !== false,
          allowGroupAdd: userData.allowGroupAdd !== false,
          showMobileNumber: userData.showMobileNumber || false
        });
        
        if (userData.Avatar) {
          setPreviewAvatar(userData.Avatar);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate, userdata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate('/login');
        return;
      }
      

      const formDataToSend = new FormData();
      formDataToSend.append('mobileNumber', formData.mobileNumber);
      formDataToSend.append('interests', formData.interests);
      formDataToSend.append('workExperience', formData.workExperience);
      formDataToSend.append('showMobileNumber', privacySettings.showMobileNumber);
      formDataToSend.append('allowChat', privacySettings.allowChat);
      formDataToSend.append('allowGroupAdd', privacySettings.allowGroupAdd);
      if (formData.avatar) {
        formDataToSend.append('Avatar', formData.avatar);
      }
      
      const response = await axios.put(
        `${import.meta.env.VITE_backend_URL}/users/Profile-Setting`,
        formDataToSend,
        {
          headers: {
             Authorization: `Bearer ${user?.Token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("updated");
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {success && (
              <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h2>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={previewAvatar || '/default-avatar.png'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <PencilIcon className="h-4 w-4" />
                  </label>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Click to change avatar</span>
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interests
                </label>
                <textarea
                  id="interests"
                  name="interests"
                  rows="3"
                  value={formData.interests}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your hobbies, skills, etc."
                />
              </div>

              <div>
                <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Work Experience
                </label>
                <textarea
                  id="workExperience"
                  name="workExperience"
                  rows="3"
                  value={formData.workExperience}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your professional experience"
                />
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Privacy Settings</h3>
              
              <div className="space-y-3">
                {/* Allow Chat Option */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="allowChat"
                      name="allowChat"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={privacySettings.allowChat}
                      onChange={handlePrivacyChange}
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
                      name="allowGroupAdd"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={privacySettings.allowGroupAdd}
                      onChange={handlePrivacyChange}
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
                      name="showMobileNumber"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={privacySettings.showMobileNumber}
                      onChange={handlePrivacyChange}
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

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function PencilIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

export default SettingsPage;