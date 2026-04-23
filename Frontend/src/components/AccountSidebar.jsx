import React from "react";

const AccountSidebar = ({ user, closeSidebar }) => {
  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0";
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="absolute right-4 top-16 w-72 bg-[#111827] border border-white/10 rounded-xl shadow-lg p-6 z-50">
      {/* Close Button */}

      <div className="flex justify-end">
        <button
          onClick={closeSidebar}
          className="text-slate-400 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      {/* Profile Section */}

      <div className="flex flex-col items-center mt-2">
        {/* Profile Image */}

        <img
          src={user?.image}
          alt="profile"
          className="w-20 h-20 rounded-full object-cover mb-4"
        />

        {/* Name */}

        <h3 className="text-lg font-semibold">{user?.name || "User"}</h3>

        {/* Email */}

        <p className="text-sm text-slate-400 mt-1">{user?.email || "email"}</p>

        {/* Role */}

        <p className="text-xs text-blue-400 mt-2">{user?.role}</p>
      </div>

      {/* Divider */}

      <div className="border-t border-white/10 my-6"></div>

      {/* Logout */}

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default AccountSidebar;
