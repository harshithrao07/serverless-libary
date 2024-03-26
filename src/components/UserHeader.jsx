import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Subscriptions from "./Subscriptions";

const UserHeader = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  return (
    <div className="mt-12 lg:mt-16 font-body text-primary-200">
      <div className="flex flex-col py-5 bg-orange-200 bg-opacity-50 px-5 lg:px-16">
        <span className="text-2xl md:text-4xl font-bold pb-1">
          Heyy,{" "}
          <span className="text-primary-100 border-b-2 border-primary-100">
            {username}
          </span>{" "}
          !
        </span>
        <Subscriptions />
      </div>
      <nav className="px-16 font-body text-lg my-5 text-gray-500 flex justify-center md:justify-start">
        <NavLink
          end
          className={({ isActive }) =>
            isActive ? "text-orange-700" : "text-black"
          }
          to="."
        >
          <span className="mx-3">Cart</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "text-orange-700" : "text-black"
          }
          to="orders"
        >
          <span className="mx-3">Orders</span>
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default UserHeader;
