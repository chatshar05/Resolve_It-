import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="w-64 min-h-screen bg-[#0b0f19] border-r border-white/10 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">ResolveIt</h1>

      <nav className="flex flex-col gap-4">

        {role === "Student" && (
          <>
            <Link
              to="/studentdash"
              className="hover:bg-white/10 px-4 py-2 rounded"
            >
              Dashboard
            </Link>
          </>
        )}

        {role === "Staff" && (
          <>
            <Link
              to="/staffdash"
              className="hover:bg-white/10 px-4 py-2 rounded"
            >
              Dashboard
            </Link>
          </>
        )}

        {role === "Admin" && (
          <>
            <Link
              to="/admindash"
              className="hover:bg-white/10 px-4 py-2 rounded"
            >
              Dashboard
            </Link>
          </>
        )}

      </nav>

    </div>
  );
};

export default Sidebar;