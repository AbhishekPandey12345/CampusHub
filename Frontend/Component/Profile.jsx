import React, { useState, useEffect ,useContext} from 'react';
import axios from 'axios';
import PostManager from './PostManager';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { LoginContext } from './Logincontext.jsx';

const ProfilePage = () => {

  const { islogin, setIslogin } = useContext(LoginContext);
  const [data, setData] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
        if(!getLocalStorageItem) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/Profile`, {
          headers: {
            Authorization: `Bearer ${getLocalStorageItem?.Token}`,
          }
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Determine if user is alumni or student
  const currentYear = new Date().getFullYear();
  const isAlumni = data.Profiledata.batchYear && data.Profiledata.batchYear < currentYear;
  const statusText = isAlumni ? 'Alumni' : 'Student';
  const statusIcon = isAlumni ? (
    <GraduationCapIcon className="w-4 h-4 text-yellow-500" />
  ) : (
    <BookOpenIcon className="w-4 h-4 text-blue-500" />
  );

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleLogout = () => {
    setIslogin(false);
    localStorage.removeItem("user");
    navigate('/login');
  };

  const handlePrivacyChange = async (setting, value) => {
    try {
      const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/Profile`, {
          headers: {
            Authorization: `Bearer ${getLocalStorageItem?.Token}`,
          }
        });
        setData(response.data.data);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0 mr-4 relative">
              <img
                alt="Profile Photo"
                className="rounded-full"
                height={64}
                src={data.Profiledata.Avatar}
                style={{
                  aspectRatio: "64/64",
                  objectFit: "cover",
                }}
                width={64}
              />
              {isCurrentUser && (
                <button 
                  onClick={handleEditProfile}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {data.Profiledata.username}
                </h2>
                {isCurrentUser && (
                  <div className="relative">
                    <button
                      onClick={toggleSettings}
                      className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                    </button>
                    
                    {showSettings && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                        <button
                          onClick={handleEditProfile}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Rest of your profile content */}
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">{data.countFollower}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserPlusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">{data.countFollowing}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {statusIcon}
                  <span className={`font-medium ${isAlumni ? 'text-yellow-500' : 'text-blue-500'}`}>
                    {statusText}
                  </span>
                </div>
              </div>
              {data.Profiledata.batchYear && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Batch of {data.Profiledata.batchYear}
                </div>
              )}
              {data.Profiledata.branch && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {data.Profiledata.branch}
                </div>
              )}
            </div>
          </div>

          {/* Additional Profile Information */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">About</h3>
            <p className="text-gray-700 dark:text-gray-300">{data.Profiledata.FullName}</p>
            
            {data.Profiledata.interests && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Interests</h4>
                <p className="text-gray-600 dark:text-gray-400">{data.Profiledata.interests}</p>
              </div>
            )}

            {data.Profiledata.workExperience && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Work Experience</h4>
                <p className="text-gray-600 dark:text-gray-400">{data.Profiledata.workExperience}</p>
              </div>
            )}

            {data.Profiledata.mobileNumber && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Contact</h4>
                <p className="text-gray-600 dark:text-gray-400">{data.Profiledata.mobileNumber}</p>
              </div>
            )}
          </div>

          {/* Posts Section */}
          <div className="grid grid-cols-3 gap-4 p-6">
            {data.Posts.map((post, index) => (
              <PostManager key={index} posts={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Your existing icon components remain the same
// ...
function GraduationCapIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}


function UserPlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}



export default ProfilePage;