import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SinglePost = () => {
  const navigation = useNavigate();
  const { postid } = useParams();
  let [data, setData] = useState(null);
  let [comment, setComment] = useState([]);
  let [noofcomment, setNoofcomment] = useState(0);
  let [nooflike, setNooflike] = useState(0);
  let [isilike, setIsilike] = useState(false);
  let [comm, setComm] = useState({
    Comment: "",
    post_id: postid,
  });
  const [mediaType, setMediaType] = useState(null);

  useEffect(() => {
    const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/users/Post/detail`, {
          params: {
            post_id: postid
          },
          headers: {
            Authorization: `Bearer ${getLocalStorageItem?.Token}`,
          }
        });

        setIsilike(response.data.data.isilike)
        setData(response.data.data.Postinfo);
        if (response.data.data.AllComment) {
          setComment(response.data.data.AllComment);
        }
        else {
          setComment([]);
        }
        console.log(response.data.data)
        setNoofcomment(response.data.data.Postinfo.NoofComment)
        setNooflike(response.data.data.Postinfo.Nooflike)
        if (!response.data.data.Postinfo.Postimg) {
          return; // Handle missing post image/video
        }

        const isVideo = response.data.data.Postinfo.Postimg.toLowerCase().endsWith('.mp4');
        setMediaType(isVideo ? 'video' : 'image');

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const addComment = async (e) => {
    e.preventDefault();
    if (!comm.Comment) {
      return;
    }

    try {
      const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
      const headers = {
        Authorization: `Bearer ${getLocalStorageItem?.Token}`,
      };
      const response = await axios.post(`${import.meta.env.VITE_backend_URL}/users/Post/addcomment`, comm, { headers });

      setNoofcomment(response.data.data.Nocomm)
      if (response.data.data.comments) {
        setComment(response.data.data.comments);
      }
      else {
        setComment([]);
      }
      setComm({ ...comm, Comment: '' });
      toast.success("Done Sucessfully");
    } catch (error) {
      toast.error("Some Error occur while adding the comment");
    }
  };
  const deletecomment = async (comm_id) => {
    try {
      const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
      const headers = {
        Authorization: `Bearer ${getLocalStorageItem?.Token}`,
      };
      const response = await axios.post(`${import.meta.env.VITE_backend_URL}/users/Post/delcomment`, { comm_id: comm_id, postid: postid }, { headers })

      setNoofcomment(response.data.data.Nocomm)
      if (response.data.data.comments) {
        setComment(response.data.data.comments);
      }
      else {
        setComment([]);
      }
      toast.success("Done Sucessfully");
    } catch (error) {
      toast.error("something went wrong or you can delete it");
    }
  };

  const handleInput = (event) => {
    setComm({ ...comm, [event.target.name]: event.target.value });
  };
  const hitlikebutton = debounce(async () => {
    const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
    const headers = {
      Authorization: `Bearer ${getLocalStorageItem?.Token}`,
    };
    try {
      const response = await axios.post(`${import.meta.env.VITE_backend_URL}/users/Post/hitlike`, {
        post_id: postid
      }, { headers });
      setNooflike(response.data.data.nooflike);
      setIsilike(response.data.data.isilike);
      toast.success("Successfully hit like button");
    }
    catch (err) {
      toast.error("Something went wrong");
    }
  }, 3000); // Set debounce delay (e.g., 300ms)
  if (!data) {
    return <div className="flex justify-center items-center h-screen">
      <p className="text-center">Not Found</p>
    </div>
  }
  const handledelete = async () => {
    try {
      const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
      const headers = {
        Authorization: `Bearer ${getLocalStorageItem?.Token}`,
      };

      await axios.post(`${import.meta.env.VITE_backend_URL}/users/Post/delete`, { postid: postid, username: data.Username }, { headers });
      navigation("/Allpost");
    } catch (error) {
      toast.error("this post not belong to you")
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-blue-100">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
          {data.title}
        </h1>

        <div className="relative h-screen flex items-center justify-center">
          {mediaType === 'image' ? (
            <img
              alt="Blog post cover image"
              className="max-w-full max-h-full object-cover"
              src={data.Postimg}
              style={{ minWidth: "128px" }}
            />
          ) : (
            <video width="840" height="360" controls>
              <source src={data.Postimg} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="absolute top-4 right-4">
            <button className="rounded-full p-2 bg-gray-700 hover:bg-gray-800 text-white" onClick={handledelete}>
              <TrashIcon className="h-5 w-5" />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
            {data.Username ? data.Username.charAt(0).toUpperCase() : 'J'}
          </div>
          <div className="text-lg">{data.Username ? data.Username : "Jhon"}</div>
        </div>
        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          <p>{data.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div onClick={hitlikebutton} className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <HeartIcon className="w-5 h-5 fill-current" />
              <span>{nooflike}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <MessageCircleIcon className="w-5 h-5 fill-current" />
              <span>{noofcomment}</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Comments</h2>
          {comment.map((com) => (
            <div className="space-y-6" key={com._id}>
              <div className="flex flex-row items-start space-x-4">
                <div className="flex flex-row space-x-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{com.Username}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{com.Content}</p>
                  <button
                    onClick={() => deletecomment(com._id)}
                    aria-label="Delete comment"
                    className=" h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <XIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

            </div>
          ))

          }
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Post a Comment</h2>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="comment">Comment</label>
              <textarea name="Comment" placeholder="Write your comment" onChange={handleInput} />
            </div>
            <button onClick={addComment} className="bg-blue-700" type="submit">Post Comment</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  function HeartIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isilike ? "red" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    );
  }
};


function MessageCircleIcon(props) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

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
export default SinglePost;
