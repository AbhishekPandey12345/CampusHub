import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from '../Component/Register.jsx';
import ProfilePage from '../Component/Profile.jsx';
import ChangeAvatarPage from '../Component/ChangeAvatar.jsx';
import LoginPage from '../Component/Login.jsx';
import ButtonPage from '../Component/header.jsx';
import PostPage from '../Component/Post_somethings.jsx';
import SinglePost from '../Component/SinglePost.jsx';
import ProfilePage1 from '../Component/Profile1.jsx';
import GetAllPost from '../Component/GetallPost.jsx';
import ChangePasswordCard from '../Component/ChangePassword.jsx';
import ChatPage from '../Component/chatpage.jsx';
import SettingsPage  from '../Component/SettingPage.jsx';
import { LoginProvider } from '../Component/Logincontext.jsx';
import ProfileDisplay from '../Component/ProfileByBranch.jsx';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ButtonPage />,

      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "UpdateAvatar",
          element: <ChangeAvatarPage />,
        }, {
          path: "",
          element: <ProfilePage />,
        },
        {
          path: "AllPost",
          element: <GetAllPost />
        }
        , {
          path: "Post/:postid",
          element: <SinglePost />
        },
        {
          path: "Profile/:_id",
          element: <ProfilePage1 />,
        }, {
          path: "ChangePassword",
          element: <ChangePasswordCard />,
        },
        {
          path: "Profiles",
          element: <ProfileDisplay/>,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "Post",
          element: <PostPage />,
        },
        {
          path: "chatpage",
          element: <ChatPage/>,
        },
        {
          path :'edit-profile',
          element : <SettingsPage/>
        },
      ],
    },
  ]);
  return (
    <LoginProvider>
    <div>
      <RouterProvider router={router} />
    </div>
    </LoginProvider>
  );
}

export default App