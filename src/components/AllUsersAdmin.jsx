import React from "react";

const AllUsersAdmin = ({allUsers, subscribedUsers}) => {

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-200">Users</h1>
      </header>
      {allUsers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">All Users:</h2>
          <ul>
            {allUsers.map((user, index) => (
              <li key={index} className="mb-2">
                <span className="text-lg font-medium">{user.email}</span>
                <span className="text-gray-500 ml-2">{new Date(user.created).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {subscribedUsers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold my-4">Subscribed Users:</h2>
          <ul>
            {subscribedUsers.map((user, index) => (
              <li key={index} className="mb-2">
                <span className="text-lg font-medium">{user}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllUsersAdmin;
