import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ portal }) => {

  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {

    document.cookie = "token=; Max-Age=0";
    navigate("/login");

  };

  return (
    <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center bg-[#0b0f19] text-white">

      <div>
        <Link to="/" className="text-lg font-semibold">
          ResolveIt
        </Link>

        <p className="text-xs text-slate-400">
          {portal} Portal
        </p>
      </div>

      {/* Account Dropdown */}

      <div className="relative">

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-sm text-slate-300 hover:text-white"
        >
          My Account
        </button>

        {showMenu && (

          <div className="absolute right-0 mt-2 w-40 bg-[#111827] border border-white/10 rounded-lg shadow-lg">

            <button
              className="block w-full text-left px-4 py-2 hover:bg-white/10"
            >
              Profile
            </button>

            <button
              className="block w-full text-left px-4 py-2 hover:bg-white/10"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default Navbar;