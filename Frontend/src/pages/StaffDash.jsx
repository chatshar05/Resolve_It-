import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AccountSidebar from "../components/AccountSidebar";

const StaffDash = () => {

  const [complaints, setComplaints] = useState([]);
  const [mode, setMode] = useState("assigned");

  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionImage, setResolutionImage] = useState(null);
  const [resolutionDesc, setResolutionDesc] = useState("");

  useEffect(() => {

    const fetchComplaints = async () => {

      try {

        const res = await api.get("/complaints/staff");
        setComplaints(res.data.complaints);

      } catch (err) {

        console.log(err);

      }

    };

    fetchComplaints();

  }, []);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  const updateStatus = async (id, status) => {

    try {

      const res = await api.patch(`/complaints/${id}/status`, { status });

      setComplaints(prev =>
        prev.map(c =>
          c._id === id ? res.data.complaint : c
        )
      );

    } catch (err) {

      console.log(err);
      alert("Failed to update status");

    }

  };

  const resolveComplaint = async () => {

    try {

      const formData = new FormData();

      formData.append("image", resolutionImage);
      formData.append("description", resolutionDesc);

      const res = await api.post(
        `/complaints/${selectedComplaint}/resolve`,
        formData
      );

      setComplaints(prev =>
        prev.map(c =>
          c._id === selectedComplaint ? res.data.complaint : c
        )
      );

      setShowResolveModal(false);
      setResolutionDesc("");
      setResolutionImage(null);

    } catch (err) {

      console.log(err);
      alert("Failed to resolve complaint");

    }

  };

  const assignedComplaints = complaints.filter(
    c => c.status !== "resolved"
  );

  const completedComplaints = complaints.filter(
    c => c.status === "resolved"
  );

  const getStatusStyle = (status) => {

    if (status === "assigned") return "bg-purple-500/20 text-purple-400";
    if (status === "in-progress") return "bg-blue-500/20 text-blue-400";
    if (status === "resolved") return "bg-green-500/20 text-green-400";

  };

  return (

    <div className="min-h-screen bg-[#0b0f19] text-white">

      {/* Navbar */}

      <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">

        <div>
          <Link to="/" className="text-lg font-semibold">
            ResolveIt
          </Link>
          <p className="text-xs text-slate-400">
            Staff Portal
          </p>
        </div>

        <div className="relative">

          <button
            onClick={() => setShowAccount(!showAccount)}
            className="text-sm text-slate-300"
          >
            My Account
          </button>

          {showAccount && (
            <AccountSidebar
              user={user}
              closeSidebar={() => setShowAccount(false)}
            />
          )}

        </div>

      </div>

      <div className="p-10 max-w-7xl mx-auto">

        {/* Dashboard Stats */}

        <div className="grid grid-cols-4 gap-6 mb-10">

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Total Complaints</p>
            <h3 className="text-2xl font-bold">{complaints.length}</h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Pending Forward</p>
            <h3 className="text-2xl font-bold text-yellow-400">
              {complaints.filter(c => c.status === "assigned").length}
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">In Progress</p>
            <h3 className="text-2xl font-bold text-blue-400">
              {complaints.filter(c => c.status === "in-progress").length}
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Resolved</p>
            <h3 className="text-2xl font-bold text-green-400">
              {complaints.filter(c => c.status === "resolved").length}
            </h3>
          </div>

        </div>

        {/* Mode Switch */}

        <div className="flex gap-6 mb-8">

          <button
            onClick={() => setMode("assigned")}
            className={`px-5 py-2 rounded-lg ${
              mode === "assigned"
                ? "bg-blue-600"
                : "bg-white/5 border border-white/10"
            }`}
          >
            Assigned Complaints
          </button>

          <button
            onClick={() => setMode("completed")}
            className={`px-5 py-2 rounded-lg ${
              mode === "completed"
                ? "bg-blue-600"
                : "bg-white/5 border border-white/10"
            }`}
          >
            Completed Complaints
          </button>

        </div>

        {/* Assigned Complaints */}

        {mode === "assigned" && (

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">

            <h3 className="text-xl font-semibold mb-6">
              Assigned Complaints
            </h3>

            {assignedComplaints.map(c => (

              <div
                key={c._id}
                className="border border-white/10 p-5 rounded-lg bg-black/20 mb-4"
              >

                <Link to={`/complaint/${c._id}`}>

                  <div className="flex justify-between mb-2">

                    <h4 className="font-semibold">
                      Complaint #{c._id}
                    </h4>

                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(c.status)}`}>
                      {c.status}
                    </span>

                  </div>

                  <p className="text-slate-300 mb-3">
                    {c.description}
                  </p>

                  {c.image && (
                    <img
                      src={c.image}
                      alt="complaint"
                      className="w-32 h-32 object-cover rounded-lg border border-white/10 mb-3"
                    />
                  )}

                </Link>

                <div className="flex gap-3">

                  <button
                    onClick={() => updateStatus(c._id,"in-progress")}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Start Work
                  </button>

                  <button
                    disabled={c.status !== "in-progress"}
                    onClick={()=>{
                      setSelectedComplaint(c._id);
                      setShowResolveModal(true);
                    }}
                    className={`px-3 py-1 rounded ${
                      c.status !== "in-progress"
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600"
                    }`}
                  >
                    Done
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* Completed Complaints */}

        {mode === "completed" && (

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">

            <h3 className="text-xl font-semibold mb-6">
              Completed Complaints
            </h3>

            {completedComplaints.map(c => (

              <Link key={c._id} to={`/complaint/${c._id}`}>

                <div className="border border-white/10 p-5 rounded-lg bg-black/20 mb-4">

                  <h4 className="font-semibold mb-2">
                    Complaint #{c._id}
                  </h4>

                  <p className="text-slate-300 mb-3">
                    {c.description}
                  </p>

                  {c.image && (
                    <img
                      src={c.image}
                      alt="complaint"
                      className="w-32 h-32 object-cover rounded-lg border border-white/10"
                    />
                  )}

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

      {/* Resolve Modal */}

      {showResolveModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#111827] p-6 rounded-lg w-[400px]">

            <h3 className="text-lg font-semibold mb-4">
              Upload Resolution
            </h3>

            <input
              type="file"
              onChange={(e)=>setResolutionImage(e.target.files[0])}
              className="mb-4"
            />

            <textarea
              placeholder="Describe what you fixed..."
              value={resolutionDesc}
              onChange={(e)=>setResolutionDesc(e.target.value)}
              className="w-full p-2 bg-black/30 border border-white/10 rounded mb-4"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setShowResolveModal(false)}
                className="px-3 py-1 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={resolveComplaint}
                className="px-3 py-1 bg-green-600 rounded"
              >
                Submit
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default StaffDash;