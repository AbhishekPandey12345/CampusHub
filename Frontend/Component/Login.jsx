import React, { useEffect, useState ,useContext} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from './Logincontext.jsx';
const LoginPage = () => {
  const navigation = useNavigate();
  const { islogin, setIslogin } = useContext(LoginContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIslogin(false);
      localStorage.removeItem("user");
      navigation("/register")
    }
  }, []);
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const get = await axios.post(`${import.meta.env.VITE_backend_URL}/users/login`, {
          username: username,
          password: password
      });
      
      setIslogin(true)
      toast.success("Successfully Logged In");
      localStorage.setItem("user", JSON.stringify(get.data.data));
      navigation("/Allpost");
      setUsername('');
      setPassword('');
  } catch (err) {
      toast.error(err)
      console.log(err);
      toast.error(err.response?.data?.message || "Login failed");
  }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <ToastContainer/>
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1" htmlFor="username">
              Username
            </label>
            <input
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
              id="username"
              placeholder="Enter your username"
              type="text"
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
              placeholder="Enter your password"
              type="password"
              onChange={handlePasswordChange}
            />
          </div>
          <button onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
