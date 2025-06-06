import React, { useState } from 'react';
import search1 from '/search.png'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormOverlay({ onClose }) {
    const [getsearchuser, setGetSearchUser] = useState([]);
     const [alluseradd, setalluseradd] = useState([]);
    const [alluserid, setalluserid] = useState([]);
    const [searchValue, setsearchValue] = useState();
    const [groupname , setGroupname] = useState();

    const search = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/FindUser`, {
                params: { search: searchValue }
            });

            setGetSearchUser(response.data.data);

        } catch (error) {
            console.error('Error searching for users:', error);
        }
    }
    function searchFunction() {
        search();
    };
    function debounce(callback, delay) {
        let timer
        return function () {
            clearTimeout(timer)
            timer = setTimeout(() => {
                callback();
            }, delay)
        }
    }

    const handleSearchChange = debounce(searchFunction, 1000);
    const handleInputChange = (event) => {
        setsearchValue(event.target.value);
    };
    const handleGroupName = (event) => {
        setGroupname(event.target.value);
    };
    const adduser = (userid, username) => {
        setalluserid(prevAllUserId => [...prevAllUserId, userid]);
        setGetSearchUser([]);
        setalluseradd(prevAllUserId => [...prevAllUserId, { _id: userid, username: username }]);
        console.log(alluseradd);
    };
    const deletuser = (userid) => {
        setalluserid((prevAllUserId) => prevAllUserId.filter((id) => id !== userid));
        setalluseradd((prevAllUserAdd) =>
            prevAllUserAdd.filter((user) => user._id !== userid)
        );
    }
    const [postimg, setPostimg] = useState(null);
    const handleAvatarChange = (event) => {
        setPostimg(event.target.files[0]);
    };
    const create = async()=>{
        try{
        const userValue = localStorage.getItem("user");
        const user = JSON.parse(userValue);
       const config = { headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user?.Token}`,
          }
        }

         await axios.post(`${import.meta.env.VITE_backend_URL}/users/creategroup` , {
            groupname: groupname ,
            users: JSON.stringify(alluserid),
            Postimg: postimg,
        }, config);
        toast.success("Sccefully Group Created");   
    }
    catch(err){
        toast.error("Something Went Wrong");
    }
    }
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
           <ToastContainer/>
            <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
                >
                    X
                </button>
                <h2 className="text-2xl font-bold mb-4">Create Group Chat</h2>
                <>  <div >
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="image">
                            Image
                        </label>
                        <div className="flex justify-center items-center w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg">
                            <input className="hidden" type="file"
                                required accept="image/*" id="image" onChange={handleAvatarChange} />
                            <label
                                className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                htmlFor="image"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <span>Upload Image/Video</span>
                            </label>
                        </div>
                        </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Group Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            onChange={handleGroupName}
                            value={groupname}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            <div className="flex items-center">
                                <span>Add People</span>
                                <img src={search1} className="w-5 h-5 ml-2" alt="" onClick={handleSearchChange} />
                            </div>
                        </label>

                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            onChange={handleInputChange}
                            value={searchValue}
                        />
                    </div>
                    <div className="flex-1 max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <ul className="flex flex-row space-x-3">
                            {alluseradd.map((chat, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between px-1 py-1 bg-white rounded-md my-1"
                                // onClick={() => adduser(chat._id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div>
                                            <div className="text-sm text-gray-500">{chat.username}</div>
                                        </div>
                                    </div>
                                    <button onClick={()=>deletuser(chat._id)}>X</button>
                                    
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <ul>
                            {getsearchuser.map((chat, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between px-6 py-3 bg-white rounded-md my-1"
                                    onClick={() => adduser(chat._id, chat.username)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <img src={chat.Avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                                        <div>
                                            <div className="font-semibold">{chat.username}</div>
                                            <div className="text-sm text-gray-500">{chat.FullName}</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                       onClick={create}
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Submit
                    </button>
                </>
            </div>
        </div>
    );
}

export default FormOverlay;
