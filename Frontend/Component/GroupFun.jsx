import React, { useEffect, useState } from 'react'
import search1 from '/search.png'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Groupfun({ _id, onClose, acesschat }) {
  
  const [SelectedUser, setSelectedUser] = useState([])
  const [userList, setUserList] = useState([])
  const [newGroupName, setNewGroupName] = useState("")
  const search = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/FindUser`, {
        params: { search: searchValue }
      });

      setSelectedUser(response.data.data);
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
  const [Groupname , SetGroupname] = useState(null);
  const handleSearchChange = debounce(searchFunction, 1000);
  const handleAddUser = async({userid}) => {
      
      const userValue = localStorage.getItem("user");
      const user = JSON.parse(userValue);
      try{
        const get = await axios.post(`${import.meta.env.VITE_backend_URL}/users/addtogroup`,{
          chatid:_id , user:userid
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.Token}`,
          }
        });
        setUserList(get.data.data.users);
        toast.success("Successfully Added");
      }
      catch(err){
        toast.error("Somethings Went Wrong");
      }
    }
  const handleRemoveUser = async (userid) => {
    const userValue = localStorage.getItem("user");
    const user = JSON.parse(userValue);
    try{
      const get = await axios.post(`${import.meta.env.VITE_backend_URL}/users/removetogroup`,{
        chatid:_id , user:userid
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.Token}`,
        }
      });
  
      setUserList(get.data.data.users);    
      toast.success("Successfully Remove");
    }
    catch(err){
      toast.error("Somethings Went Wrong");
    }
  }
  const [searchValue , setsearchValue] = useState([])
  const handleInputChange = (event) => {
    setsearchValue(event.target.value);
  };
  const handleRenameGroup = async() => {
    const userValue = localStorage.getItem("user");
    const user = JSON.parse(userValue);
    try{
     await axios.post(`${import.meta.env.VITE_backend_URL}/users/renamegroup`,{
        chatid:_id , chatname: newGroupName,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.Token}`,
        }
      });
      SetGroupname(newGroupName);
      // setUserList(get.data.data.users);    
      toast.success("Successfully Rename");
    }
    catch(err){
      toast.error("Somethings Went Wrong");
    }    
  }
  const [admin_id , setadmin_id] = useState(null)
  useEffect(() => {
    setadmin_id(acesschat.groupAdmin);
    setUserList(acesschat.users);
    SetGroupname(acesschat.chatname);
  }, []);
  // userList.map((user)=>{
  //   console.log(user);
  // })
  // console.log(userList);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <ToastContainer/>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
      >
        X
      </button>
      <div className="bg-white p-8 rounded shadow-lg">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Manage Group :- {Groupname}</h1>
          </header>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-bold">Add User to Group</h2>
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
                <div className="flex-1 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <ul>
                            {SelectedUser.map((chat, index) => (
                                <li   
                                    key={index}
                                    className="flex items-center justify-between px-6 py-3 bg-white rounded-md my-1"
                                    onClick={() => handleAddUser({userid:chat._id})}
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
            </div>
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-bold">Remove User from Group</h2>
                <div className="space-y-2">
                  {userList.map((user, index) => (
                  <> {user._id != admin_id &&  <div
                      key={index}
                      className="flex items-center justify-between rounded-md bg-gray-100 p-3 dark:bg-gray-800"
                    >
                      <span>{user.username}</span>
                      <button variant="ghost" size="icon" onClick={() => handleRemoveUser({userid:user._id})}>
                        <TrashIcon className="h-5 w-5" />
                        <span className="sr-only">Remove user</span>
                      </button>
                    </div> }
                    </>
                   ))}
                </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-bold">Rename Group</h2>
                <div>
                  <label htmlFor="new-name">New Name</label>
                  <input
                    id="new-name"
                    type="text"
                    placeholder="Enter a new name"
                    value={newGroupName}
                    className='rounded'
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full rounded bg-blue-500" onClick={handleRenameGroup}>
                  Rename
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Groupfun

// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select"

function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}