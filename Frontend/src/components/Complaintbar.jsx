import React, { useState, useEffect } from "react";
import api from "../services/api";

const Complaintbar = ({ closeBar, addComplaint, editingComplaint }) => {
  const [formData, setFormData] = useState({
    description: "",
    category: "wifi",
    priority: "medium",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingComplaint) {
      setFormData({
        description: editingComplaint.description,
        category: editingComplaint.category,
        priority: editingComplaint.priority,
      });
    }
  }, [editingComplaint]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();

      formDataObj.append("description", formData.description);
      formDataObj.append("category", formData.category);
      formDataObj.append("priority", formData.priority);

      if (image) {
        formDataObj.append("image", image);
      }

      let res;

      if (editingComplaint) {
        res = await api.patch(
          `/complaints/${editingComplaint._id}/edit`,
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        res = await api.post("/complaints", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      addComplaint(res.data.complaint);

      closeBar();
    } catch (err) {
      console.log(err);
      alert("Failed to save complaint");
    }
  };

  const detectAI = async (text) => {
    if (text.length < 10) return;

    try {
      const res = await api.post("/ai/analyze", {
        description: text,
      });

      setFormData((prev) => ({
        ...prev,
        category: res.data.category,
        priority: res.data.priority,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={closeBar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] bg-[#111827] border border-white/10 rounded-xl p-8 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-white mb-6">
          {editingComplaint ? "Edit Complaint" : "Create Complaint"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Description */}

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue..."
            className="bg-[#0b0f19] border border-white/10 text-white p-3 rounded-lg resize-none"
            rows="4"
          />

          <button
            type="button"
            onClick={() => detectAI(formData.description)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Analyze with AI
          </button>

          {/* Category */}

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="bg-[#0b0f19] border border-white/10 text-white p-2 rounded-lg"
          >
            <option value="wifi">WiFi</option>
            <option value="hostel">Hostel</option>
            <option value="electricity">Electricity</option>
            <option value="classroom">Classroom</option>
            <option value="other">Other</option>
          </select>

          {/* Priority */}

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="bg-[#0b0f19] border border-white/10 text-white p-2 rounded-lg"
          >
            <option value="severe">Severe</option>
            <option value="moderate">Moderate</option>
            <option value="medium">Medium</option>
          </select>

          {/* Image Upload */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="text-sm text-slate-300"
          />

          {/* Show existing image when editing */}

          {editingComplaint?.image && (
            <img
              src={editingComplaint.image}
              alt="complaint"
              className="rounded-lg border border-white/10 w-40 mt-2"
            />
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={closeBar}
              className="px-4 py-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingComplaint ? "Update Complaint" : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Complaintbar;
