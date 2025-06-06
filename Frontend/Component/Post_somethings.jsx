// RegisterPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatBubble from './Chatbot.jsx';

const PostPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [postimg, setPostimg] = useState(null);
    const handletitlechange = (event) => {
        setTitle(event.target.value);
    };

    const handleAvatarChange = (event) => {
        setPostimg(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
        try {
            await axios.post(`${import.meta.env.VITE_backend_URL}/users/Post/Upload`, {
                description: description,
                title: title,
                Postimg: postimg,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getLocalStorageItem?.Token}`,
                }
            });

            toast.success("Succefully Post Added");
        }
        catch (err) {
            toast.error("any error ocurred");
        };
        setTitle('');
        setDescription('');
        setPostimg(null);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Create New Post</h1>
                <form className="space-y-6">
                    <div >
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="image">
                            Image/Video
                        </label>
                        <div className="flex justify-center items-center w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg">
                            <input className="hidden" type="file"
                                required accept="image/*,video/*" id="image" onChange={handleAvatarChange} />
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
                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="title">
                            Title
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            id="title"
                            placeholder="Enter a title"
                            type="text"
                            required
                            value={title}
                            onChange={handletitlechange}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            id="description"
                            placeholder="Enter a description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSubmit}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="submit"
                        >
                            Save
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </div>
            <ChatBubble/>
        </div>
    )

}

export default PostPage;

