import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostManager from './PostManager';

const GetAllPost = () => {
    const [data, setData] = useState(null);
    let [skip, setSkip] = useState(0);
    let [pages, setPages] = useState(0);
    const limit = 9;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
                const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/allPost?skip=${skip}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${getLocalStorageItem?.Token}`,
                    }
                });
              
                setData(response.data.data);
                setPages(Math.ceil(response.data.data.totalCount / limit));
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchData();
    }, [skip]); // Depend on skip value

    // This useEffect runs only once, when the component mounts
    // useEffect(() => {
    //     fetchData();
    // }, []); // Empty dependency array for initial mount

    if (!data) {
        return <div>Loading...</div>; // Add a loading indicator while fetching data
    }
    
    return (
        <>
            <div className="grid grid-cols-3 gap-4 p-6">
                {
                    data.posts.map((post, index) => {
                        return (<PostManager key={index} posts={post} />)
                    })
                }
            </div>
            <div className="flex items-center justify-center py-8">
                <nav aria-label="Pagination">
                    <ul className="inline-flex items-center -space-x-px">
                        {skip != 0 ? <li

                            className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={() => setSkip(skip - limit)}
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clipRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    fillRule="evenodd"
                                />
                            </svg>

                        </li> : ""}

                            <ul className="flex flex-wrap">
                                {(() => {
                                    const listItems = [];
                                    for (let i = 1; i <= pages; i++) {
                                        const isSelected = (skip === ((i-1)*limit));
                                        listItems.push(
                                            <li
                                                key={i}
                                                className={`px-3 py-2 leading-tight text-gray-500 ${isSelected ? 'bg-pink-500' : 'bg-white'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                                onClick={() => setSkip((i - 1) * limit)}
                                                role="button"
                                            >
                                                {/* Render the content for each list item */}
                                                Page {i}
                                            </li>
                                        );
                                    }
                                    return listItems;
                                })()}
                            </ul>
                          


                            {skip < (pages * limit - limit) ? <li
                                className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                onClick={() => setSkip(skip + limit)}
                            >
                                <span className="sr-only">Next</span>
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </li> : ""}
                        </ul>
                </nav>
            </div>

        </>
    );

}

export default GetAllPost;
// return (
//   <div className="flex items-center justify-center py-8">
//     <nav aria-label="Pagination">
//       <ul className="inline-flex items-center -space-x-px">
//         <li>
//           <a
//             className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             href="#"
//           >
//             <span className="sr-only">Previous</span>
//             <svg
//               aria-hidden="true"
//               className="w-5 h-5"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 clipRule="evenodd"
//                 d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                 fillRule="evenodd"
//               />
//             </svg>
//           </a>
//         </li>
//         <li>
//           <a
//             className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             href="#"
//           >
//             1
//           </a>
//         </li>
//         <li>
//           <a
//             className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             href="#"
//           >
//             2
//           </a>
//         </li>
//         <li>
//           <a
//             className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             href="#"
//           >
//             3
//           </a>
//         </li>
//         <li>
//           <a
//             className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             href="#"
//           >
//             ...
//           </a>
//         </li>
//         <li>
//           <a
//             className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             href="#"
//           >
//             10
//           </a>
//         </li>
//         <li>
//           <a
//             className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             href="#"
//           >
//             <span className="sr-only">Next</span>
//             <svg
//               aria-hidden="true"
//               className="w-5 h-5"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 clipRule="evenodd"
//                 d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                 fillRule="evenodd"
//               />
//             </svg>
//           </a>
//         </li>
//       </ul>
//     </nav>
//   </div>
// )
