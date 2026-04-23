import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AccountSidebar from "../components/AccountSidebar";
import Complaintbar from "../components/Complaintbar";

const StudentDash = () => {

  const [complaints, setComplaints] = useState([]);
  const [showBar, setShowBar] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState(null);

  useEffect(() => {

    const fetchComplaints = async () => {

      try {

        const res = await api.get("/complaints/my");
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

  const addComplaint = (newComplaint) => {
    setComplaints((prev) => [...prev, newComplaint]);
  };

  const activeComplaints = complaints.filter((c) => c.status !== "resolved");
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved");

  const totalComplaints = complaints.length;

  const openComplaints = complaints.filter(
    (c) => c.status === "open"
  ).length;

  const assignedComplaints = complaints.filter(
    (c) => c.status === "assigned"
  ).length;

  const inProgressComplaints = complaints.filter(
    (c) => c.status === "in-progress"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "resolved"
  ).length;

  const getStatusStyle = (status) => {

    if (status === "open") return "bg-yellow-500/20 text-yellow-400";
    if (status === "assigned") return "bg-purple-500/20 text-purple-400";
    if (status === "in-progress") return "bg-blue-500/20 text-blue-400";
    if (status === "resolved") return "bg-green-500/20 text-green-400";

  };

  const deleteComplaint = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));

    } catch (err) {

      console.log(err);
      alert("Failed to delete complaint");

    }

  };

  const canEdit = (createdAt) => {

    const created = new Date(createdAt);
    const now = new Date();

    const diff = (now - created) / (1000 * 60);

    return diff < 5;

  };

  return (

    <div className="min-h-screen bg-[#0b0f19] text-white">

      {/* Navbar */}

      <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">

        <div>
          <Link to="/" className="text-lg font-semibold">
            ResolveIt
          </Link>
          <p className="text-xs text-slate-400">Student Portal</p>
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

        {/* Header */}

        <div className="flex justify-between mb-10">

          <div>
            <h2 className="text-3xl font-bold">Student Dashboard</h2>
            <p className="text-slate-400">
              Submit and track complaints
            </p>
          </div>

          <button
            onClick={() => setShowBar(true)}
            className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Complaint
          </button>

        </div>

        {showBar && (
          <Complaintbar
            closeBar={() => {
              setShowBar(false);
              setEditingComplaint(null);
            }}
            addComplaint={addComplaint}
            editingComplaint={editingComplaint}
          />
        )}

        {/* STATUS CARDS */}

        <div className="grid grid-cols-5 gap-6 mb-10">

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Total Complaints</p>
            <h3 className="text-2xl font-bold">{totalComplaints}</h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Open</p>
            <h3 className="text-2xl font-bold text-yellow-400">
              {openComplaints}
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Assigned</p>
            <h3 className="text-2xl font-bold text-purple-400">
              {assignedComplaints}
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">In Progress</p>
            <h3 className="text-2xl font-bold text-blue-400">
              {inProgressComplaints}
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <p className="text-slate-400 text-sm">Resolved</p>
            <h3 className="text-2xl font-bold text-green-400">
              {resolvedCount}
            </h3>
          </div>

        </div>

        {/* Active Complaints */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">

          <h3 className="text-xl font-semibold mb-6">
            Active Complaints
          </h3>

          {activeComplaints.map((c) => (

            <Link key={c._id} to={`/complaint/${c._id}`}>

              <div className="border border-white/10 p-5 rounded-lg bg-black/20 mb-4 hover:bg-black/30 cursor-pointer">

                <div className="flex justify-between mb-2">

                  <h4 className="font-semibold">
                    Complaint #{c._id}
                  </h4>

                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(c.status)}`}
                  >
                    {c.status}
                  </span>

                </div>

                <p className="text-slate-300">{c.description}</p>

              </div>

            </Link>

          ))}

        </div>

        {/* Resolved Complaints */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h3 className="text-xl font-semibold mb-6">
            Resolved Complaints
          </h3>

          {resolvedComplaints.map((c) => (

            <Link key={c._id} to={`/complaint/${c._id}`}>

              <div className="border border-white/10 p-5 rounded-lg bg-black/20 mb-4 hover:bg-black/30 cursor-pointer">

                <h4 className="font-semibold mb-2">
                  Complaint #{c._id}
                </h4>

                <p className="text-slate-300">
                  {c.description}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>

  );

};

export default StudentDash;