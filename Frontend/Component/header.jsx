import axios from 'axios';
import React, { useEffect, useState , useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import photo from '/abhi_photo.jpeg'
import { useNotification } from './Notification';
import { NavLink } from 'react-router-dom';
import { LoginContext } from './Logincontext.jsx';

const DropdownMenuTrigger = ({ children }) => {
    return <div className="relative">{children}</div>;
};

// Custom DropdownMenuItem component
const DropdownMenuItem = ({ children }) => {
    return <div>{children}</div>;
};
const DropdownMenuContent = ({ children }) => {
    return (
        <div className="absolute z-10 mt-2 w-48 origin-top bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 left-1/2 transform -translate-x-1/2">
            {children}
        </div>
    );
};

// Custom DropdownMenuContent component


// Custom DropdownMenu component
const DropdownMenu = ({ children }) => {
    return <div className="py-1">{children}</div>;
};


const ButtonPage = () => {
    const [searchValue, setSearchValue] = useState("");
    const { islogin, setIslogin } = useContext(LoginContext);
    const [getsearchuser, setGetSearchUser] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const { notification } = useNotification();
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

    // Make sure to declare setSearchValue outside the function to avoid re-initializing it on each call
    const navigate = useNavigate();
    const searchclick = (id) => {
      console.log(id);
        setGetSearchUser([]);
        navigate(`/Profile/${id}`);

    }
    useEffect(() => {
        const userValue = localStorage.getItem("user");
        if (userValue) setIslogin(true);
    }, []);
    const handlevalue = (event) => {
        setSearchValue(event.target.value);
    };
    return (
  <div>
    <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5">
      <div className="flex items-center gap-4">
        <img src={photo} alt="photo" className="rounded-full object-contain h-10" />
        <nav className="hidden space-x-4 md:flex">
          {islogin ? (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-sm font-medium text-blue-500" : "text-sm font-medium hover:underline"
                }
                to=""
              >
                Profile
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-sm font-medium text-blue-500" : "text-sm font-medium hover:underline"
                }
                to="/Allpost"
              >
                AllPost
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-sm font-medium text-blue-500" : "text-sm font-medium hover:underline"
                }
                to="/Post"
              >
                Post
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-sm font-medium text-blue-500" : "text-sm font-medium hover:underline"
                }
                to="/ChangePassword"
              >
                ChangePassword
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-sm font-medium text-blue-500" : "text-sm font-medium hover:underline"
                }
                to="/Profiles"
              >
                Profiles
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "relative inline-block text-blue-500" : "relative inline-block"
                }
                to="/chatpage"
              >
                <MessageCircleIcon className="h-6 w-6" />
                {notification != 0 && (
                  <div className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center">
                    {notification}
                  </div>
                )}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-sm font-medium text-blue-500" : "text-sm font-medium hover:underline"
                }
                to="/register"
              >
                Register
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-sm font-medium text-blue-500" : "text-sm font-medium hover:underline"
                }
                to="/login"
              >
                Login
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button size="icon" variant="outline" onClick={toggleMenu}>
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </button>
          </DropdownMenuTrigger>
          {isOpen && (
            <DropdownMenuContent align="middle" className="w-48">
              {islogin ? (
                <>
                  <DropdownMenuItem>
                    <NavLink
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "block px-4 py-2 text-sm font-medium bg-blue-500 text-white"
                          : "block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      to=""
                    >
                      Profile
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "block px-4 py-2 text-sm font-medium bg-blue-500 text-white"
                          : "block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      to="/Allpost"
                    >
                      AllPost
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "block px-4 py-2 text-sm font-medium bg-blue-500 text-white"
                          : "block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      to="/Post"
                    >
                      Post
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "block px-4 py-2 text-sm font-medium bg-blue-500 text-white"
                          : "block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      to="/ChangePassword"
                    >
                      ChangePassword
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "block px-4 py-2 text-sm font-medium bg-blue-500 text-white"
                          : "block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      to="/Profiles"
                    >
                      Profiles
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "relative inline-block text-blue-500" : "relative inline-block"
                      }
                      onClick={toggleMenu}
                      to="/chatpage"
                    >
                      <MessageCircleIcon className="h-6 w-6" />
                      {notification != 0 && (
                        <div className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center">
                          {notification}
                        </div>
                      )}
                    </NavLink>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <NavLink
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "block px-4 py-2 text-sm font-medium bg-blue-500 text-white"
                          : "block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      to="/login"
                    >
                      Login
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "block px-4 py-2 text-sm font-medium bg-blue-500 text-white"
                          : "block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      to="/register"
                    >
                      Register
                    </NavLink>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>

      {islogin ? (
        <div className="relative flex flex-shrink w-18 md:mx-2 lg:mx-3">
          <div className="absolute right-3 top-1/2 -translate-y-1/2" onClick={handleSearchChange}>
            <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            className="w-full rounded-md border border-gray-300 bg-white px-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Search..."
            type="search"
            value={searchValue || ''}
            onChange={handlevalue}
          />
        </div>
      ) : ("")}
    </header>

    {getsearchuser.map((user) => (
      <div className="mt-4 max-h-[300px] overflow-y-auto" key={user._id} onClick={() => searchclick(user._id)}>
        <div className="grid gap-4">
          <div className="flex items-center gap-4 mx-10">
            <img alt="UserImg" src={user.Avatar} className="rounded-full object-contain h-12" />
            <div className="flex-1">
              <h4 className="font-medium">{user.username}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.FullName}</p>
            </div>
          </div>
        </div>
      </div>
    ))}

    <Outlet />
    <div className="flex flex-col">
      <main className="flex-1" />
      <footer className="bg-gray-900 py-6 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p className="text-sm">© 2024 Acme Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  </div>
);

    
};

export default ButtonPage;




function MenuIcon(props) {
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
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}


function SearchIcon(props) {
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}

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
    )
}