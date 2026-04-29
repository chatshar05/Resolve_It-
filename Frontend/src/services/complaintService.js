import api from "./api";

export const createComplaint = (formData) => {
  return api.post("/complaints", formData);
};

export const getMyComplaints = () => {
  return api.get("/complaints/my");
};

export const getAllComplaints = () => {
  return api.get("/complaints/admin");
};

export const assignComplaint = (id, staffId) => {
  return api.patch(`/complaints/${id}/assign`, { staffId });
};

export const getAssignedComplaints = () => {
  return api.get("/complaints/staff");
};

export const updateComplaintStatus = (id, status) => {
  return api.patch(`/complaints/${id}/status`, { status });
};