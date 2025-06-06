import axios from 'axios';
import React, { useState ,useContext} from 'react';
import { useNavigate } from 'react-router-dom'
import { LoginContext } from './Logincontext.jsx';


const Card = ({ children, className }) => {
    return (
        <div className={`border border-gray-300 rounded-lg shadow-sm p-2 ${className}`}>
            {children}
        </div>
    );
};

const CardHeader = ({ children }) => {
    return (
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 rounded-t-lg">
            {children}
        </div>
    );
};

const CardTitle = ({ children }) => {
    return (
        <h2 className="text-xl font-semibold text-gray-800">
            {children}
        </h2>
    );
};

const CardDescription = ({ children }) => {
    return (
        <p className="text-sm text-gray-600">
            {children}
        </p>
    );
};

const CardContent = ({ children }) => {
    return (
        <div className="p-4">
            {children}
        </div>
    );
};

const CardFooter = ({ children }) => {
    return (
        <div className="bg-gray-100 px-4 py-2 border-t border-gray-300 rounded-b-lg">
            {children}
        </div>
    );
};

const Label = ({ htmlFor, children }) => {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
            {children}
        </label>
    );
};


const ChangePasswordCard = () => {
    const navigation = useNavigate();
    let [password, setPassword] = useState('');
    let [oldpassword, setOldPassword] = useState('');
    const { islogin, setIslogin } = useContext(LoginContext);
    const handlesummit = async (e) => {
        e.preventDefault()
        if (password === '') {
            // Handle the case where the password is not empty
        } else {
            try {
                const getLocalStorageItem = JSON.parse(localStorage.getItem("user"));
                const headers = {
                    Authorization: `Bearer ${getLocalStorageItem?.Token}`,
                };
                 await axios.post(`${import.meta.env.VITE_backend_URL}/users/ChangePassword`, { newPassword: password, oldPassword: oldpassword }, { headers });
               const user = localStorage.getItem("user");
                if (user) {
                    localStorage.removeItem("user");
                    navigation("/login");
                    setIslogin(false);
                }
            } catch (error) {
                // Handle errors
                console.error("Error changing password:", error);
                // You can also show a notification to the user or perform other actions based on the error
            }
        }
    }


    return (
        <form className="w-full max-w-sm mx-auto rounded-lg my-24">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Enter your new password below to update your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="oldpassword">Old Password</Label>
                    <input onChange={(e) => { setOldPassword(e.target.value) }} id="oldpassword" placeholder="Enter new password" required type="old-password" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
            </CardContent>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <input onChange={(e) => { setPassword(e.target.value) }} id="new-password" placeholder="Enter new password" required type="new-password" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
            </CardContent>
            <CardFooter>
                <button onClick={handlesummit} className="py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 w-full" >Update Password</button>
            </CardFooter>
        </form>
    );
};

export default ChangePasswordCard;
