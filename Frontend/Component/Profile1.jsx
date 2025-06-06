import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostManager from './PostManager';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PencilIcon } from '@heroicons/react/24/outline';

const ProfilePage1 = () => {
    const [data, setData] = useState(null);
    const [isMyAccount, setIsMyAccount] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [noOfFollower, setNoOfFollower] = useState(0);
    const [noOfFollowing, setNoOfFollowing] = useState(0);
    const { _id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
                if (!getLocalStorageItem) {
                    navigate('/login');
                    return;
                }
                
                const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/Profile/alt`, {
                    params: { _id: _id },
                    headers: {
                        Authorization: `Bearer ${getLocalStorageItem?.Token}`,
                    }
                });
                console.log(response.data.data);
                setData(response.data.data);
                setIsMyAccount(response.data.data.isyouraccount);
                setNoOfFollower(response.data.data.countFollower);
                setNoOfFollowing(response.data.data.countFollowing);
                setIsFollowing(response.data.data.isfollowing);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                toast.error('Failed to load profile data');
            }
        };

        fetchData();
    }, [_id, navigate]);

    const handleFollow = async () => {
        const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_backend_URL}/users/Follow/request`, 
                { user_id: _id },
                {
                    headers: {
                        Authorization: `Bearer ${getLocalStorageItem?.Token}`,
                    }
                }
            );
            
            setNoOfFollower(response.data.data.followers);
            setNoOfFollowing(response.data.data.following);
            setIsFollowing(response.data.data.isfollowing);
            
            toast.success(`Successfully ${isFollowing ? "Unfollowed" : "Followed"}`);
        } catch (error) {
            toast.error("Something went wrong");
            console.error('Error following user:', error);
        }
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    if (!data) {
        return <div className="text-center py-12">Loading...</div>;
    }

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
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150';
                                }}
                            />
                            {isMyAccount && (
                                <button 
                                    onClick={handleEditProfile}
                                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full hover:bg-indigo-700 transition-colors"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {data.Profiledata.username}
                            </h2>
                            <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                    <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-gray-500 dark:text-gray-400">{noOfFollower}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <UserPlusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-gray-500 dark:text-gray-400">{noOfFollowing}</span>
                                </div>
                                {!isMyAccount && (
                                    <button 
                                        onClick={handleFollow}
                                        className={`px-3 py-1 text-sm rounded-md ${
                                            isFollowing 
                                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                                : 'bg-blue-600 text-white'
                                        }`}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        {data.Profiledata.FullName && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                                <p className="text-gray-900 dark:text-gray-100">{data.Profiledata.FullName}</p>
                            </div>
                        )}

                        {data.Profiledata.branch && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Branch</h3>
                                <p className="text-gray-900 dark:text-gray-100">{data.Profiledata.branch}</p>
                            </div>
                        )}

                        {data.Profiledata.workExperience && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Work Experience</h3>
                                <p className="text-gray-900 dark:text-gray-100">{data.Profiledata.workExperience}</p>
                            </div>
                        )}

                        {data.Profiledata.interests && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Interests</h3>
                                <p className="text-gray-900 dark:text-gray-100">{data.Profiledata.interests}</p>
                            </div>
                        )}

                        {data.Profiledata.mobileNumber && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</h3>
                                <p className="text-gray-900 dark:text-gray-100">{data.Profiledata.mobileNumber}</p>
                            </div>
                        )}
                    </div>

                    {/* Posts Section */}
                    <div className="grid grid-cols-3 gap-4 p-6">
                        {data.Posts.map((post, index) => (
                            <PostManager key={index} posts={post} />
                        ))}
                    </div>
                    
                    <ToastContainer position="bottom-right" autoClose={3000} />
                </div>
            </div>
        </div>
    );
};

// Icon components remain the same as in your original code
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
    );
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
    );
}

export default ProfilePage1;