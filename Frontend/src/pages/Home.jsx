import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white font-sans">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-32 px-6">
        {/* gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0b0f19] via-[#10182b] to-[#1a2440]" />

        {/* glow shapes */}
        <div className="absolute top-[-200px] left-[20%] w-[600px] h-[600px] bg-blue-600/30 blur-[160px] rounded-full -z-10" />
        <div className="absolute bottom-[-200px] right-[10%] w-[500px] h-[500px] bg-purple-600/30 blur-[160px] rounded-full -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            Your Campus Complaints,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Perfectly Resolved
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            ResolveIt connects students, staff and administrators in a unified
            complaint resolution system designed for modern campuses.
          </p>

          <div className="flex justify-center gap-5">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium"
            >
              Get Started
            </button>

            <button className="border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section className="py-28 px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Three Powerful Portals
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Student */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition">
            <div className="text-4xl mb-4">🎓</div>

            <h3 className="text-2xl font-semibold mb-5">Student Portal</h3>

            <ul className="space-y-3 text-slate-300">
              <li>✓ Submit complaints easily</li>
              <li>✓ Track complaint status</li>
              <li>✓ View complaint history</li>
            </ul>
          </div>

          {/* Staff */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition">
            <div className="text-4xl mb-4">💼</div>

            <h3 className="text-2xl font-semibold mb-5">Staff Portal</h3>

            <ul className="space-y-3 text-slate-300">
              <li>✓ View assigned complaints</li>
              <li>✓ Update progress</li>
              <li>✓ Add resolution notes</li>
            </ul>
          </div>

          {/* Admin */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition">
            <div className="text-4xl mb-4">🛠️</div>

            <h3 className="text-2xl font-semibold mb-5">Admin Portal</h3>

            <ul className="space-y-3 text-slate-300">
              <li>✓ View all complaints</li>
              <li>✓ Assign staff</li>
              <li>✓ Analytics dashboard</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-28 px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Choose ResolveIt?
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white/5 border border-white/10 p-10 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">
              Streamlined Communication
            </h3>

            <p className="text-slate-400">
              Connect students, staff and administrators through one smart
              complaint resolution platform built for universities.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-4 text-purple-400">
              Data-Driven Insights
            </h3>

            <p className="text-slate-400">
              Identify campus trends using dashboards and analytics to improve
              infrastructure efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-slate-500">
        © 2026 ResolveIt — Smart Campus Complaint System
      </footer>
    </div>
  );
};

export default Home;
