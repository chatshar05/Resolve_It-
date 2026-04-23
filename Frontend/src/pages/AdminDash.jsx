import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AccountSidebar from "../components/AccountSidebar";

const AdminDash = () => {

  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("active");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/complaints/admin");
        setComplaints(res.data.complaints);
      } catch (err) {
        console.log(err);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get("/complaints/staff-users");
        setStaff(res.data.staff);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const assignComplaint = async (complaintId, staffId) => {
    try {

      const res = await api.patch(`/complaints/${complaintId}/assign`, {
        assignedTo: staffId
      });

      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? res.data.complaint : c))
      );

    } catch (err) {

      console.log(err);
      alert("Failed to assign complaint");

    }
  };

  const activeComplaints = complaints.filter((c) => c.status !== "resolved");
  const completedComplaints = complaints.filter((c) => c.status === "resolved");

  const totalComplaints = complaints.length;
  const pendingForward = complaints.filter((c) => c.status === "open").length;

  const inProgress = complaints.filter(
    (c) => c.status === "assigned" || c.status === "in-progress"
  ).length;

  const resolved = complaints.filter((c) => c.status === "resolved").length;

  const getStatusStyle = (status) => {

    if (status === "open") return "bg-yellow-500/20 text-yellow-400";
    if (status === "assigned") return "bg-purple-500/20 text-purple-400";
    if (status === "in-progress") return "bg-blue-500/20 text-blue-400";
    if (status === "resolved") return "bg-green-500/20 text-green-400";

  };

  return (

  <div className="min-h-screen bg-[#0b0f19] text-white">

  {/* NAVBAR */}

  <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">

  <div>
  <Link to="/" className="text-lg font-semibold">
  ResolveIt
  </Link>

  <p className="text-xs text-slate-400">
  Admin Portal
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

  {/* DASHBOARD STATS */}

  <div className="grid grid-cols-4 gap-6 mb-10">

  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
  <p className="text-slate-400 text-sm">Total Complaints</p>
  <h3 className="text-2xl font-bold">{totalComplaints}</h3>
  </div>

  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
  <p className="text-slate-400 text-sm">Pending Forward</p>
  <h3 className="text-2xl font-bold text-yellow-400">{pendingForward}</h3>
  </div>

  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
  <p className="text-slate-400 text-sm">In Progress</p>
  <h3 className="text-2xl font-bold text-blue-400">{inProgress}</h3>
  </div>

  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
  <p className="text-slate-400 text-sm">Resolved</p>
  <h3 className="text-2xl font-bold text-green-400">{resolved}</h3>
  </div>

  </div>

  {/* MODE SWITCH */}

  <div className="flex gap-6 mb-10">

  <button
  onClick={() => setMode("active")}
  className={`px-5 py-2 rounded-lg ${mode === "active" ? "bg-blue-600" : "bg-white/5 border border-white/10"}`}
  >
  Active Complaints
  </button>

  <button
  onClick={() => setMode("resolved")}
  className={`px-5 py-2 rounded-lg ${mode === "resolved" ? "bg-blue-600" : "bg-white/5 border border-white/10"}`}
  >
  Resolved Complaints
  </button>

  <button
  onClick={() => setMode("staff")}
  className={`px-5 py-2 rounded-lg ${mode === "staff" ? "bg-blue-600" : "bg-white/5 border border-white/10"}`}
  >
  Staff Members
  </button>

  </div>

  {/* ACTIVE COMPLAINTS */}

  {mode === "active" && (

  <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">

  <h3 className="text-xl font-semibold mb-6">
  Active Complaints
  </h3>

  {activeComplaints.map((c) => (

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

  </Link>

  {c.status === "open" && (

  <select
  onChange={(e) => assignComplaint(c._id, e.target.value)}
  className="bg-[#111827] border border-white/10 px-3 py-2 rounded w-full"
  >

  <option value="">Assign Staff</option>

  {staff.map((s) => {

  const working = complaints.filter(
  (co) =>
  co.assignedTo?._id === s._id &&
  co.status === "in-progress"
  ).length;

  return (

  <option key={s._id} value={s._id}>
  {s.name} | {s.category} | Working: {working}
  </option>

  );

  })}

  </select>

  )}

  </div>

  ))}

  </div>

  )}

  {/* STAFF MODE */}

  {mode === "staff" && (

  <div className="grid grid-cols-3 gap-6">

  {staff.map((s) => {

  const assigned = complaints.filter(
  (c) => c.assignedTo?._id === s._id
  ).length;

  const completed = complaints.filter(
  (c) => c.assignedTo?._id === s._id && c.status === "resolved"
  ).length;

  const working = complaints.filter(
  (c) => c.assignedTo?._id === s._id && c.status === "in-progress"
  ).length;

  return (

  <div
  key={s._id}
  className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center text-center hover:border-blue-500/40 transition"
  >

  <img
  src={s.image}
  alt="staff"
  className="w-24 h-24 rounded-full object-cover border-2 border-white/20 mb-4"
  />

  <h3 className="text-xl font-semibold">
  {s.name}
  </h3>

  <p className="text-slate-400 text-sm mb-2">
  {s.email}
  </p>

  <p className="text-purple-400 font-medium mb-6">
  Category: {s.category || "Not set"}
  </p>

  <div className="grid grid-cols-3 gap-4 w-full text-sm">

  <div className="bg-black/30 border border-white/10 p-3 rounded-lg">
  <p className="text-blue-400 font-semibold">{assigned}</p>
  <p className="text-slate-400 text-xs">Assigned</p>
  </div>

  <div className="bg-black/30 border border-white/10 p-3 rounded-lg">
  <p className="text-yellow-400 font-semibold">{working}</p>
  <p className="text-slate-400 text-xs">In Progress</p>
  </div>

  <div className="bg-black/30 border border-white/10 p-3 rounded-lg">
  <p className="text-green-400 font-semibold">{completed}</p>
  <p className="text-slate-400 text-xs">Completed</p>
  </div>

  </div>

  </div>

  );

  })}

  </div>

  )}

  </div>

  </div>

  );

};

export default AdminDash;