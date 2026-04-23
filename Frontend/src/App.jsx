import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDash from "./pages/StudentDash";
import AdminDash from "./pages/AdminDash";
import StaffDash from "./pages/StaffDash";
import ComplaintDetails from "./pages/ComplaintDetails";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Dashboard */}
      <Route
        path="/studentdash"
        element={
          <ProtectedRoute allowedRole="Student">
            <StudentDash />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admindash"
        element={
          <ProtectedRoute allowedRole="Admin">
            <AdminDash />
          </ProtectedRoute>
        }
      />

      {/* Staff Dashboard */}
      <Route
        path="/staffdash"
        element={
          <ProtectedRoute allowedRole="Staff">
            <StaffDash />
          </ProtectedRoute>
        }
      />

      {/* Complaint Details */}
      <Route path="/complaint/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
