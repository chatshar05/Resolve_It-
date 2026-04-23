import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const ComplaintDetails = () => {

  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {

    const fetchComplaint = async () => {

      try {

        const res = await api.get(`/complaints/${id}`);
        setComplaint(res.data.complaint);

      } catch (err) {

        console.log(err);

      }

    };

    fetchComplaint();

  }, [id]);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        Loading complaint...
      </div>
    );
  }

  const progressWidth =
    complaint.status === "open"
      ? "0%"
      : complaint.status === "assigned"
      ? "33%"
      : complaint.status === "in-progress"
      ? "66%"
      : "100%";

  return (

    <div className="min-h-screen bg-[#0b0f19] text-white p-10">

      <Link to={-1} className="text-blue-400 mb-6 inline-block">
        ← Back
      </Link>

      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8">

        <h1 className="text-2xl font-bold mb-10">
          Complaint #{complaint._id}
        </h1>

        {/* PROGRESS BAR */}

        <div className="relative w-full mb-12">

          {/* Background line */}

          <div className="absolute top-4 left-0 w-full h-1 bg-gray-600 rounded"></div>

          {/* Active line */}

          <div
            className="absolute top-4 left-0 h-1 bg-purple-600 rounded transition-all duration-500"
            style={{ width: progressWidth }}
          ></div>

          {/* Steps */}

          <div className="relative flex justify-between">

            <Step active label="Registered" />

            <Step
              active={["assigned","in-progress","resolved"].includes(complaint.status)}
              label="Assigned"
              sub={complaint.assignedTo?.name}
            />

            <Step
              active={["in-progress","resolved"].includes(complaint.status)}
              label="In Progress"
            />

            <Step
              active={complaint.status === "resolved"}
              label="Completed"
            />

          </div>

        </div>

        {/* TWO COLUMN VIEW */}

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT SIDE - STUDENT COMPLAINT */}

          <div className="bg-black/20 border border-white/10 rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-4 text-yellow-400">
              Submitted Complaint
            </h2>

            <p className="text-slate-300 mb-4">
              {complaint.description}
            </p>

            {complaint.image && (
              <img
                src={complaint.image}
                alt="complaint"
                className="rounded-lg border border-white/10"
              />
            )}

          </div>

          {/* RIGHT SIDE - STAFF RESOLUTION */}

          <div className="bg-black/20 border border-white/10 rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-4 text-green-400">
              Staff Resolution
            </h2>

            {complaint.status !== "resolved" && (
              <p className="text-slate-400">
                Complaint not completed yet
              </p>
            )}

            {complaint.resolutionDescription && (
              <p className="text-slate-300 mb-4">
                {complaint.resolutionDescription}
              </p>
            )}

            {complaint.resolutionImage && (
              <img
                src={complaint.resolutionImage}
                alt="resolution"
                className="rounded-lg border border-white/10"
              />
            )}

          </div>

        </div>

      </div>

    </div>

  );

};


const Step = ({ active, label, sub }) => (

  <div className="flex flex-col items-center z-10">

    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all
      ${active
        ? "bg-purple-600 border-purple-600 text-white"
        : "bg-[#0b0f19] border-gray-500 text-gray-400"
      }`}
    >
      ✓
    </div>

    <p className="text-sm mt-2 text-slate-300">
      {label}
    </p>

    {sub && (
      <p className="text-xs text-blue-400">
        {sub}
      </p>
    )}

  </div>

);

export default ComplaintDetails;