import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

const PostManager = ({ posts }) => {
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState(null);
  const handleclick = () => {
    navigate(`/Post/${posts._id}`);
  }

  useEffect(() => {
    const determineMediaType = async () => {
      if (!posts.Postimg) {
        return; // Handle missing post image/video
      }

      const isVideo = posts.Postimg.toLowerCase().endsWith('.mp4');
      setMediaType(isVideo ? 'video' : 'image');
    };

    determineMediaType();
  }, []);

  return (

    <div className="bg-white rounded-lg overflow-hidden shadow-sm dark:bg-gray-950">
      {(mediaType === 'image') ? <div className="relative" onClick={handleclick}>
        <img
          alt=""
          className="aspect-video w-full object-cover"
          src={posts.Postimg}
        />
      </div> : <div>
        <video width="640" height="360" controls onClick={handleclick}>
          <source src={posts.Postimg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
            {posts.Username ? posts.Username.charAt(0).toUpperCase() : 'J'}
          </div>
          <div className="text-sm font-medium">{posts.Username ? posts.Username : "Jhon"}</div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <MessageSquareIcon className="h-4 w-4" />
            <span>{posts.NoofComment}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <HeartIcon className="h-4 w-4" />
            <span>{posts.Nooflike}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostManager


function HeartIcon(props) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}


function MessageSquareIcon(props) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}