import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    category: ""
  });

  const [image, setImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef(null);             // These reference DOM elements.   used to access video element and canvas element
  const canvasRef = useRef(null);             //Because capturing images requires direct DOM access.

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // ================= START CAMERA =================

  const startCamera = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });

      setCameraOpen(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

    } catch (err) {

      console.error("Camera error:", err);
      alert("Camera permission denied");

    }

  };

  // ================= CAPTURE PHOTO =================

  const capturePhoto = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob((blob) => {

      const file = new File([blob], "profile.jpg", {
        type: "image/jpeg"
      });

      setImage(file);

    });

    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }

    setCameraOpen(false);

  };

  // ================= RETAKE =================

  const retakePhoto = () => {
    setImage(null);
    startCamera();
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!image) {
      alert("Please capture profile photo");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    data.append("category", formData.category);
    data.append("image", image);

    try {

      await api.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Registration successful");

    } catch (err) {

      console.log(err);
      alert("Registration failed");

    }

  };

  return (

  <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white">

  <form
  onSubmit={handleSubmit}
  className="bg-[#111827] p-8 rounded-xl w-96 border border-white/10"
  >

  <h2 className="text-2xl font-semibold mb-6 text-center">
  Register
  </h2>

  <input
  type="text"
  name="name"
  placeholder="Full Name"
  value={formData.name}
  onChange={handleChange}
  className="w-full p-2 mb-4 bg-[#0b0f19] border border-white/10 rounded"
  required
  />

  <input
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
  className="w-full p-2 mb-4 bg-[#0b0f19] border border-white/10 rounded"
  required
  />

  <input
  type="password"
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
  className="w-full p-2 mb-4 bg-[#0b0f19] border border-white/10 rounded"
  required
  />

  {/* ROLE SELECT */}

  <select
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="w-full p-2 mb-4 bg-[#0b0f19] border border-white/10 rounded"
  >

  <option value="Student">Student</option>
  <option value="Staff">Staff</option>
  <option value="Admin">Admin</option>

  </select>

  {/* CATEGORY (ONLY FOR STAFF) */}

  {formData.role === "Staff" && (

  <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full p-2 mb-4 bg-[#0b0f19] border border-white/10 rounded"
  required
  >

  <option value="">Select Work Category</option>

  <option value="wifi">Wifi</option>
  <option value="hostel">Hostel</option>
  <option value="electricity">Electricity</option>
  <option value="classroom">Classroom</option>
  <option value="other">Other</option>

  </select>

  )}

  {/* CAMERA BUTTON */}

  {!cameraOpen && !image && (

  <button
  type="button"
  onClick={startCamera}
  className="w-full bg-blue-600 py-2 rounded mb-4 hover:bg-blue-700"
  >

  Capture Profile Photo

  </button>

  )}

  {/* CAMERA VIEW */}

  {cameraOpen && (

  <div className="mb-4">

  <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  className="w-full rounded border border-white/10 mb-3"
  />

  <button
  type="button"
  onClick={capturePhoto}
  className="w-full bg-green-600 py-2 rounded hover:bg-green-700"
  >

  Take Photo

  </button>

  </div>

  )}

  {/* IMAGE PREVIEW */}

  {image && (

  <div className="flex flex-col items-center mb-4">

  <img
  src={URL.createObjectURL(image)}
  alt="preview"
  className="w-24 h-24 rounded-full object-cover border mb-3"
  />

  <button
  type="button"
  onClick={retakePhoto}
  className="text-sm text-blue-400"
  >

  Retake Photo

  </button>

  </div>

  )}

  <canvas ref={canvasRef} style={{ display:"none" }} />

  <button
  type="submit"
  className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
  >

  Register

  </button>

  <p className="text-center mt-4 text-sm text-gray-400">

  Already have an account?

  <Link to="/login" className="text-blue-400 ml-1">
  Login
  </Link>

  </p>

  </form>

  </div>

  );

};

export default Register;