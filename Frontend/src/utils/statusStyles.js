export const getStatusStyle = (status) => {

  if (status === "open") return "bg-yellow-100 text-yellow-700";
  if (status === "assigned") return "bg-purple-100 text-purple-700";
  if (status === "in-progress") return "bg-blue-100 text-blue-700";
  if (status === "resolved") return "bg-green-100 text-green-700";

  return "";
};