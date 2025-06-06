import { useEffect, useState } from "react";
import { FaPhoneAlt, FaBriefcase, FaHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ProfileDisplay = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]); // Initialize as empty array
  const [branch, setBranch] = useState("CSE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
        
        if (!getLocalStorageItem?.Token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/users/Profile/alt`,
          {
            params: { branch },
            headers: {
              Authorization: `Bearer ${getLocalStorageItem.Token}`,
            },
          }
        );
       
        setProfiles(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError(error.message);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [branch]);
  

  
  const branchColors = {
    CSE: { bg: "bg-blue-100", text: "text-blue-800" },
    ECE: { bg: "bg-purple-100", text: "text-purple-800" },
    ME: { bg: "bg-green-100", text: "text-green-800" },
    CE: { bg: "bg-yellow-100", text: "text-yellow-800" },
    EE: { bg: "bg-red-100", text: "text-red-800" },
    Other: { bg: "bg-gray-100", text: "text-gray-800" },
    // Added all your branch options
  };

  const handleFilterClick = (selectedBranch) => {
    setBranch(selectedBranch);
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Our Team
        </h1>

        {/* Branch Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["CSE", "ECE", "ME", "CE", "EE", "Other"].map((br) => (
            <button
              key={br}
              onClick={() => handleFilterClick(br)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                branch === br
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {br === "CSE" ? "Computer Science" : 
               br === "ECE" ? "Electronics" : 
               br === "ME" ? "Mechanical" : 
               br === "CE" ? "Civil" : 
               br === "EE" ? "Electrical" : "Other"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => {
              const safeBranch = profile?.branch || "Other";
              const colors = branchColors[safeBranch] || {
                bg: "bg-gray-100",
                text: "text-gray-800",
              };

              return (
                <div
                  key={profile._id}
                   onClick={() => navigate(`/Profile/${profile._id}`)}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                   <div className={`relative h-32 ${colors.bg}`}>
                     <img
                      src={profile?.Avatar || "https://via.placeholder.com/150"}
                      alt={profile?.FullName || "Profile"}
                      className="w-24 h-24 rounded-full border-4 border-white object-cover absolute -bottom-12 left-1/2 transform -translate-x-1/2"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                   <div className="pt-16 pb-6 px-6 text-center">
                     <h3 className="text-xl font-bold text-gray-800">
                       {profile?.FullName || "No Name"}
                     </h3>
                     <span
                      className={`inline-block mt-2 px-4 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-semibold`}
                    >
                      {safeBranch.charAt(0).toUpperCase() + safeBranch.slice(1)}
                    </span>
                    <div className="mt-4 text-left space-y-3">
                      {profile?.mobileNumber && (
                        <div className="flex items-start">
                          <FaPhoneAlt className="mt-1 mr-3 text-blue-500" />
                          <div>
                            <span className="font-medium text-gray-600">Phone:</span>
                            <span className="ml-1">{profile.mobileNumber}</span>
                          </div>
                        </div>
                      )}
                      {profile?.workExperience && (
                      <div className="flex items-start">
                        <FaBriefcase className="mt-1 mr-3 text-blue-500" />
                        <div>
                          <span className="font-medium text-gray-600">Experience:</span>
                          <span className="ml-1">{profile?.workExperience || "Not specified"}</span>
                        </div>
                      </div>
                      )}
                       {profile?.interests && (
                        <div className="flex items-start">
                          <FaHeart className="mt-1 mr-3 text-blue-500" />
                          <div>
                            <span className="font-medium text-gray-600">Interests:</span>
                            <span className="ml-1">{profile.interests}</span>
                          </div>
                        </div>
                      )}  
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">No profiles found for {branch}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDisplay;