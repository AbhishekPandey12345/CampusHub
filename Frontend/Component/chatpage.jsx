import { useEffect, useState , useRef } from "react"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import plus from '/plus.png'
import FormOverlay from "./Overlay";
import del from '/delete.png'
import write from '/write.png'
import Groupfun from "./GroupFun";
import { useNotification } from "./Notification";
import io from 'socket.io-client'


var socket;
const ChatPage = () => {
  const containerRef = useRef(null);
  const [allmessage , setallmessage] = useState([]);
  const [chats, setChats] = useState(null);
  const [chatsuser, setChatsuser] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [getsearchuser, setGetSearchUser] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [newchat,setnewchat] = useState(null);
  const [userid, setUserid] = useState(null);
  const [selectedchat , setSelectedchat] = useState(null);
  const [socketconnected , setsocketconneted] = useState(false);
  const{ notificationInc, notificationDec } = useNotification();
  const createMessage = async(_id)=>{
    const userValue = localStorage.getItem("user");
    if(newchat!=null){
    const user = JSON.parse(userValue);
    try{
     const get =  await axios.post(`${import.meta.env.VITE_backend_URL}/users/newmessage`,{
        chatid:_id ,
        content:newchat,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.Token}`,
        }
      });
      setallmessage([...allmessage , get.data.data]);
      socket.emit("new message", get.data.data);
    }
    catch(err){
      toast.error("Somethings Went Wrong");
    }
   }
  }
  useEffect(() => {
    const userValue = localStorage.getItem("user");
    const user = JSON.parse(userValue);
    const fetchChatData = async () => {
      if (userValue) {
        setUserid(user.user);
        try {
          const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/allchat`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user?.Token}`,
            }
          });
          setnewchat(null);
          setChatsuser(response.data.data);
        } catch (err) {
          toast.error("An error occurred");
        }
      }
    };
    notificationDec();
    fetchChatData();
    socket = io(import.meta.env.VITE_backend_URL);
    socket.emit("setup",user.user);
    socket.on("connection",() => setsocketconneted(true));
  }, []);

  const acesschat = async ({ _id, username }) => { 
    const userValue = localStorage.getItem("user");
    if (userValue) {
      const user = JSON.parse(userValue);
      setUserid(user.user);
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/accesschat`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.Token}`,
          },
          params: {
            getid: _id,
            username: username
          },
        });
        const res = await axios.get(`${import.meta.env.VITE_backend_URL}/users/getallmessage`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.Token}`,
          },
          params: {
            chatid: _id,
          },
        });
        setallmessage(res.data.data);
        setnewchat(null);
        setChats(response.data.data);
        setSelectedchat(response.data.data._id);
        socket.emit("join chat",response.data.data._id);
      } catch (err) {
        console.log(err);
        toast.error(err);
      }
    }

  }
  useEffect(()=>{
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

  },[allmessage]);

  

  const search = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/FindUser`, {
        params: { search: searchValue }
      });

      setGetSearchUser(response.data.data);
      if (getsearchuser.length > 0) {
        setIsSidebarVisible(true);
      }
      else {
        toast.error("No user Found");
      }
    } catch (error) {
      toast.error("An error occurred");
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

  // Make sure to declare setSearchValue outside the function to avoid re-initializing it on each call


  
  const handlevalue = (event) => {
    setSearchValue(event.target.value);
  };
  const [isFormVisible, setIsFormVisible] = useState(false);
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };
  const deletegroup = async ({_id})=>{
    setnewchat(null) 
    const userValue = localStorage.getItem("user");
    const user = JSON.parse(userValue);
    try{
      await axios.post(`${import.meta.env.VITE_backend_URL}/users/deletegroup`,{
        chatid:_id ,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.Token}`,
        }
      });
      toast.success("Successfully Delete The Group");
    }
    catch(err){
      toast.error("Somethings Went Wrong");
    }
  }
  const handleInputChange = (event) => {
    setnewchat(event.target.value);
  };

  const [showGroupfun, setShowGroupfun] = useState(false);

  const changegroup = ()=>{
    setShowGroupfun(!showGroupfun);
  }
  
  useEffect(()=>{
    socket.on("message recieved", (newMessage)=>{
      // console.log(selectedChatCompare , selectedchat , newMessage);
      if(selectedchat !== newMessage.chat._id){
      //   // give notification
        notificationInc();
      }
      else{
        setallmessage([...allmessage , newMessage]);
      }
    })
  });
  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <aside className="w-80 border-r">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          Create Group Chat
          <img src={plus} alt="" className="w-5 h-5" onClick={toggleFormVisibility} />
          {isFormVisible && <FormOverlay onClose={toggleFormVisibility} />}
        </div>
        <div className="px-6 py-2">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-md" >
            <input type="search user" placeholder="Search" className="w-full border-none" onChange={handlevalue} />
            <MicroscopeIcon className="h-5 w-5 text-gray-500" onClick={handleSearchChange} />
          </div>
        </div>
        <div className="flex h-screen">
          <div
            className={`fixed inset-y-0 left-0 transform ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300 ease-in-out bg-gray-200 w-64 p-4`}
          >
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
            <div className="h-[calc(100%-150px)] overflow-y-auto">
                {getsearchuser.map((search) => (
                  <div
                    key={search._id}
                    className="flex items-center justify-between px-6 py-3 bg-white rounded-md my-1"
                  >
                    <div className="flex items-center space-x-3" onClick={() => acesschat({ _id: null, username: search.username })}>
                      <img
                        src={search.Avatar}
                        className="w-12 h-12 rounded-full object-cover"
                        alt=""
                      />
                      <div>
                        <div className="font-semibold">{search.username}</div>
                        <div className="text-sm text-gray-500">{search.FullName}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="max-h-96 overflow-y-auto">
              {chatsuser.map((chat) => (
                <>
                  <div key={chat._id} className="flex items-center justify-between px-6 py-3 bg-white rounded-md my-1">
                    <div className="flex items-center space-x-3" onClick={() => acesschat({ _id: chat._id, username: null })}>
                     { !chat.isgroup && <img src={chat.users[0].Avatar} className="w-12 h-12 rounded-full object-cover" alt="" /> }
                      { chat.isgroup && <img src={chat.Avatar} className="w-12 h-12 rounded-full object-cover" alt="" />}
                     {!chat.isgroup && <div>
                        <div className="font-semibold">{chat.users[0].username}</div>
                        <div className="text-sm text-gray-500">{chat.latestmessage.content}</div>
                      </div>}
                      { chat.isgroup && 
                          <div>
                            <div className="font-semibold">{chat.chatname}</div>
                            <div className="text-sm text-gray-500">GroupChat</div>
                          </div>
                      }
                    </div>
                  </div>
                </>
              ))}
          </div>

        </div>

      </aside>
      <main className="flex-1">
        {chats && <div className="flex flex-col h-full"  >
          <div className="flex items-center justify-between p-6 border-b">

            <div className="flex items-center space-x-3">
            { !chats.isgroup && <img src={chats.users[0].Avatar} className="w-36 h-36 rounded-full object-cover" alt="" /> }
            { chats.isgroup && <img src={chats.Avatar} className="w-36 h-36 rounded-full object-cover" alt="" /> }
              <div className="flex items-center space-x-3 mx-60">
              {!chats.isgroup &&  <div className="font-semibold">{chats.users[0].FullName}</div>}
              {chats.isgroup &&  <div className="font-semibold">{chats.chatname}</div>}
              </div>
            </div>
            {showGroupfun && <Groupfun _id={chats._id} onClose={changegroup} acesschat = {chats}/>} 
            {chats.isgroup &&  userid == chats.groupAdmin &&  (
                  <>
                    <img src={write} className="w-6 h-6" alt="edit icon" onClick={changegroup}/>
                    <img src={del} className="w-6 h-6 " alt="delete icon" onClick={()=>deletegroup({_id:chats._id})}/> 
                  </>
              )}
          </div>
          <div ref={containerRef} className="flex-1 p-6 overflow-y-auto">
             {allmessage.map((message , index)=> 
             <div key={message._id} className={`flex items-center mb-4 ${userid == message.sender._id ? 'justify-end' : 'justify-start'}`} index = {index}>
                <img src={message.sender.Avatar} alt="" className="w-8 h-8 rounded-full object-cover mr-2"/>
                <div
                  className={`max-w-[60%] p-3 rounded-lg flex  ${
                    userid == message.sender._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                } `}
                >
                  <div className="font-semibold">{message.content}</div>
                </div>
              </div>
              )
            }
          </div>
          <div className="flex items-center justify-between p-6 border-t">
            <SmileIcon className="h-6 w-6 text-gray-500" />
            <input type="text" placeholder="Type your message..." className="flex-1 mx-4" value={newchat}
                onChange={handleInputChange} />
            <PlaneIcon className="h-6 w-6 text-gray-500" onClick={()=>createMessage(chats._id)}/>
          </div>
        </div>
        }
      </main>
    </div>
  )
}


function MicroscopeIcon(props) {
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
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  )
}


function PlaneIcon(props) {
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
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  )
}


function SmileIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}


export default ChatPage;