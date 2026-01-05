import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Header = ({ userx, setuserx }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setuserx(false);
    navigate("/");
  };

  return (
    <header className="shadow-lg sticky z-50 top-0 backdrop-blur-md bg-white/95">
      <nav className="bg-gradient-to-r from-white via-blue-50 to-purple-50 border-b border-gray-200 px-4 lg:px-6 py-3">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
              className="mr-3 h-12 transform group-hover:scale-110 transition-transform duration-300"
              alt="Logo"
            />
          </Link>

          {/* Right Buttons */}
          <div className="flex items-center lg:order-2 gap-2">
            {userx ? (
              <button
                onClick={handleLogout}
                className="text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                focus:ring-4 focus:ring-red-300 font-semibold rounded-xl 
                text-sm px-5 lg:px-6 py-2.5 lg:py-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 border-2 border-gray-300
                  focus:ring-4 focus:ring-gray-300 font-medium rounded-xl 
                  text-sm px-5 lg:px-6 py-2.5 lg:py-3 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Log in
                </Link>

                <Link
                  to="/"
                  className="text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                  focus:ring-4 focus:ring-orange-300 font-semibold rounded-xl 
                  text-sm px-5 lg:px-6 py-2.5 lg:py-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 rounded-lg hover:bg-orange-50 transition-all ${
                      isActive
                        ? "text-orange-600 font-bold bg-orange-50"
                        : "text-gray-700 hover:text-orange-600"
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 rounded-lg hover:bg-orange-50 transition-all ${
                      isActive
                        ? "text-orange-600 font-bold bg-orange-50"
                        : "text-gray-700 hover:text-orange-600"
                    }`
                  }
                >
                  About
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 rounded-lg hover:bg-orange-50 transition-all ${
                      isActive
                        ? "text-orange-600 font-bold bg-orange-50"
                        : "text-gray-700 hover:text-orange-600"
                    }`
                  }
                >
                  Contact
                </NavLink>
              </li>

              <li>
                <a
                  href="https://github.com/Saikat2345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 pr-4 pl-3 duration-200 rounded-lg hover:bg-orange-50 transition-all text-gray-700 hover:text-orange-600"
                >
                  Github
                </a>
              </li>

              <li>
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 rounded-lg hover:bg-orange-50 transition-all ${
                      isActive
                        ? "text-orange-600 font-bold bg-orange-50"
                        : "text-gray-700 hover:text-orange-600"
                    }`
                  }
                >
                  Chat
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/roomjoin"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 rounded-lg hover:bg-orange-50 transition-all ${
                      isActive
                        ? "text-orange-600 font-bold bg-orange-50"
                        : "text-gray-700 hover:text-orange-600"
                    }`
                  }
                >
                  RoomJoin
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
