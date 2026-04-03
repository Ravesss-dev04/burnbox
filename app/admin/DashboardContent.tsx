"use client";

import {
  BarChart as BarChartIcon,
  Mail,
  Users,
  Trash2,
  Eye,
  Image as ImageIcon,
  MapPin,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import Globe3D from "./components/Globe3D";

interface DashboardDarkMod {
  darkMode?: boolean;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  product: string;
  price: string;
  message: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
}

interface Visitors {
  id: number;
  ipAddress: string;
  location: string;
  city?: string | null;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
}

const DashboardContent = ({ darkMode = false }: DashboardDarkMod) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [visitors, setVisitors] = useState<Visitors[]>([]);
  const [visitorsLoading, setVisitorsLoading] = useState(true);

  // Calculate product data for chart from actual inquiries
  const productData = inquiries.reduce((acc, inquiry) => {
    const existing = acc.find((item) => item.name === inquiry.product);
    if (existing) {
      existing.inquiries++;
    } else {
      acc.push({ name: inquiry.product, inquiries: 1 });
    }
    return acc;
  }, [] as { name: string; inquiries: number }[]);

  // Calculate top product
  const topProduct =
    productData.length > 0
      ? productData.reduce((prev, current) =>
          prev.inquiries > current.inquiries ? prev : current
        ).name
      : "No inquiries";

  // Fetch inquiries from API
  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch visitors from API
  const fetchVisitors = async () => {
    try {
      const res = await fetch("/api/visitors");
      if (res.ok) {
        const data = await res.json();
        setVisitors(data);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
    } finally {
      setVisitorsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchVisitors();

    // Poll for new visitors every 10 seconds (real-time updates)
    const visitorsInterval = setInterval(() => {
      fetchVisitors();
    }, 10000);

    return () => clearInterval(visitorsInterval);
  }, []);
  const EnhancedMapCard = () => {
    const activeVisitors = visitors.filter(
      (v) => v.latitude && v.longitude && v.status === "Active"
    );

    return (
      <div className="bg-[#111] border border-white/5 rounded-xl p-6 shadow-lg hover:border-pink-500/20 transition-all duration-300 overflow-hidden relative">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-white">Visitor Locations</h3>
            <p className="text-sm text-gray-400 mt-1">
              Real-time geographic distribution
            </p>
          </div>
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <MapPin size={20} className="text-pink-500" />
          </div>
        </div>

        <div className="w-full h-[400px] flex items-center justify-center relative z-0">
          <Globe3D visitors={visitors} />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5 relative z-10 bg-[#111]/80 backdrop-blur-sm">
          <span className="text-sm text-gray-400">Total locations tracked</span>
          <span className="font-bold text-pink-500 bg-pink-500/10 px-3 py-1 rounded-full text-sm">
            {activeVisitors.length}
          </span>
        </div>
      </div>
    );
  };

  // Delete inquiry
  const deleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInquiries(inquiries.filter((inq) => inq.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      } else {
        throw new Error("Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Failed to delete inquiry");
    }
  };

  // Update inquiry status
  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setInquiries(
          inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-400">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide">
          Dashboard Overview
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back to your admin control panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Inquiries Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111] border border-white/5 rounded-xl p-6 shadow-lg hover:border-pink-500/30 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-pink-500/10 transition-colors" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Total Inquiries
              </p>
              <h3 className="text-3xl font-bold text-white group-hover:text-pink-400 transition-colors">
                {inquiries.length}
              </h3>
            </div>
            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <span className="text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded mr-2">
              <ArrowUpRight size={12} /> +12%
            </span>
            <span>vs last month</span>
          </div>
        </motion.div>

        {/* Active Visitors Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111] border border-white/5 rounded-xl p-6 shadow-lg hover:border-purple-500/30 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Active Visitors
              </p>
              <h3 className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">
                {visitorsLoading
                  ? "..."
                  : visitors.filter((v) => v.status === "Active").length}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <span className="text-purple-400 flex items-center gap-1 bg-purple-400/10 px-2 py-0.5 rounded mr-2">
              <Activity size={12} /> Live
            </span>
            <span>Real-time tracking</span>
          </div>
        </motion.div>

        {/* Top Products Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111] border border-white/5 rounded-xl p-6 shadow-lg hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                Top Product
              </p>
              <h3
                className="text-xl font-bold text-white truncate max-w-[180px] group-hover:text-blue-400 transition-colors"
                title={topProduct}
              >
                {topProduct}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
              <BarChartIcon size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <span className="text-blue-400 flex items-center gap-1 bg-blue-400/10 px-2 py-0.5 rounded mr-2">
              <ArrowUpRight size={12} /> High Demand
            </span>
            <span>Most inquired item</span>
          </div>
        </motion.div>
      </div>

      {/* Middle Section: Inquiries + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Inquiries Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#111] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Recent Inquiries</h3>
              <p className="text-sm text-gray-400 mt-1">
                Latest messages from customers
              </p>
            </div>
            <button className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
              View All
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-500">
              <Mail size={48} className="mb-4 opacity-20" />
              <p>No inquiries yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Product</th>
                    <th className="py-3 px-4 font-medium">Price</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {inquiries.slice(0, 5).map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-white group-hover:text-pink-400 transition-colors">
                            {inquiry.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[120px]">
                            {inquiry.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-300 bg-white/5 px-2 py-1 rounded text-xs">
                          {inquiry.product}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-green-400">
                          {inquiry.price}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => deleteInquiry(inquiry.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Product Interest Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#111] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Product Interest</h3>
            <p className="text-sm text-gray-400 mt-1">
              Inquiry distribution by product category
            </p>
          </div>

          <div className="flex-1 min-h-[250px]">
            {productData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      borderColor: "#333",
                      color: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="inquiries" radius={[4, 4, 0, 0]} barSize={40}>
                    {productData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#ec4899" : "#8b5cf6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <BarChartIcon size={48} className="mb-4 opacity-20" />
                <p>No product data available yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* visitors tracking table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Map Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EnhancedMapCard />
        </motion.div>

        {/* Visitors tracking table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#111] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Who's Connected</h3>
              <p className="text-sm text-gray-400 mt-1">
                Live visitor session data
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              Live
            </div>
          </div>

          {visitorsLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Loading visitors...</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>No visitors tracked yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-white/10">
                    <th className="pb-3 px-4 font-medium">IP Address</th>
                    <th className="pb-3 px-4 font-medium">Location</th>
                    <th className="pb-3 px-4 font-medium">City</th>
                    <th className="pb-3 px-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {visitors.slice(0, 8).map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-300 font-mono text-xs">
                        {v.ipAddress}
                      </td>
                      <td className="py-3 px-4 text-gray-300">{v.location}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {v.city || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            v.status === "Active"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            {/* Modal Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Inquiry Details
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Review customer request information
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowUpRight size={20} className="rotate-45" />{" "}
                {/* Using as close icon alternative or just X */}
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                    Customer Info
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {selectedInquiry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {selectedInquiry.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {selectedInquiry.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                    Product Details
                  </label>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Product</span>
                    <span className="text-white font-medium">
                      {selectedInquiry.product}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price Quote</span>
                    <span className="text-green-400 font-bold">
                      {selectedInquiry.price}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Status
                  </label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) =>
                      updateStatus(selectedInquiry.id, e.target.value)
                    }
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors"
                  >
                    <option value="New">New Inquiry</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Message
                  </label>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 min-h-[120px] text-gray-300 text-sm leading-relaxed">
                    {selectedInquiry.message}
                  </div>
                </div>

                {selectedInquiry.imageUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Attached Reference
                    </label>
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a] p-2">
                      <img
                        src={selectedInquiry.imageUrl}
                        alt="Sample layout"
                        className="w-full h-48 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10 relative z-10">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => deleteInquiry(selectedInquiry.id)}
                className="px-6 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 size={18} />
                <span>Delete Inquiry</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
