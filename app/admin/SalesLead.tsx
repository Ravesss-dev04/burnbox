'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Lead = {
  id: string;
  fullName: string;
  contactNumber: string;
  email: string;
  companyName: string;
  inquiry: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  quotationSent: boolean;
  createdAt: string;
};

interface SalesLeadProps {
  userRole?: 'ADMIN' | 'STAFF';
}

export default function SalesLead({ userRole = 'STAFF' }: SalesLeadProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    companyName: '',
    inquiry: '',
  });
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };


  
  const updateStatus = async (id: string, status: Lead['status']) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchLeads();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteLead = async (id: string, fullName: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete the lead from ${fullName} (${companyName})?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Lead deleted successfully');
        fetchLeads();
      } else {
        const error = await response.json();
        toast.error(`Failed to delete lead: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Error deleting lead');
    } finally {
      setDeletingId(null);
    }
  };

  const exportToExcel = () => {
    const headers = ['Date', 'Full Name', 'Company', 'Contact', 'Email', 'Inquiry', 'Status'];
    const csvData = leads.map(lead => [
      format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm'),
      lead.fullName,
      lead.companyName,
      lead.contactNumber,
      lead.email,
      lead.inquiry || '',
      lead.status,
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.fullName || !addFormData.contactNumber || !addFormData.email || !addFormData.companyName) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (addFormData.contactNumber.length < 10) {
      toast.error('Contact number must be at least 10 digits');
      return;
    }
    setIsSubmittingAdd(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addFormData),
      });

      if (response.ok) {
        toast.success('Successfully submitted the request.');
        setShowAddModal(false);
        setAddFormData({ fullName: '', contactNumber: '', email: '', companyName: '', inquiry: '' });
        fetchLeads();
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to add quotation');
      }
    } catch (error) {
      console.error('Error adding quotation:', error);
      toast.error('Error adding quotation');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleSendQuotationEmail = async () => {
    if (!addFormData.email) {
      toast.error('Please enter a valid email address first');
      return;
    }
    if (!addFormData.fullName && !addFormData.companyName) {
      toast.error('Please enter at least a name or company name');
      return;
    }

    setIsSendingEmail(true);
    try {
      // First save the lead to the database
      if (addFormData.contactNumber.length < 10) {
        toast.error('Contact number must be at least 10 digits');
        setIsSendingEmail(false);
        return;
      }

      const saveResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addFormData),
      });

      if (!saveResponse.ok) {
        const saveResult = await saveResponse.json();
        toast.error(saveResult.error || 'Failed to save quotation data');
        setIsSendingEmail(false);
        return;
      }

      // Then send the quotation email to the client
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quotation',
          to: addFormData.email,
          clientName: addFormData.fullName,
          companyName: addFormData.companyName,
          contactNumber: addFormData.contactNumber,
          inquiry: addFormData.inquiry,
        }),
      });

      const emailResult = await emailResponse.json();

      if (emailResponse.ok && emailResult.success) {
        toast.success(`Quotation request sent to ${addFormData.email}`);
        setShowAddModal(false);
        setAddFormData({ fullName: '', contactNumber: '', email: '', companyName: '', inquiry: '' });
        fetchLeads();
      } else {
        toast.error('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending quotation email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'PROCESSING': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'COMPLETED': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-400">Loading Sales Leads...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide">
              Sales Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage quotation requests</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Contacts
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2.5 flex items-center gap-2 bg-[#111] border border-white/10 text-gray-300 rounded-xl hover:border-pink-500/30 hover:text-white transition-all duration-300 font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-lg hover:border-pink-500/20 transition-all duration-300">
            <p className="text-sm text-gray-400 font-medium">Total Leads</p>
            <p className="text-2xl font-bold text-white mt-1">{leads.length}</p>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-lg hover:border-yellow-500/20 transition-all duration-300">
            <p className="text-sm text-gray-400 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {leads.filter(l => l.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-lg hover:border-green-500/20 transition-all duration-300">
            <p className="text-sm text-gray-400 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {leads.filter(l => l.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-lg hover:border-red-500/20 transition-all duration-300">
            <p className="text-sm text-gray-400 font-medium">Rejected</p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              {leads.filter(l => l.status === 'REJECTED').length}
            </p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-[#111] border border-white/5 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiry</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {format(new Date(lead.createdAt), 'MMM dd, HH:mm')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap group-hover:text-pink-400 transition-colors">
                      {lead.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {lead.companyName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                      {lead.contactNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      <a href={`mailto:${lead.email}`} className="hover:text-pink-400 transition-colors">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate" title={lead.inquiry || ''}>
                      {lead.inquiry || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value as Lead['status'])}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none ${getStatusColor(lead.status)} bg-transparent`}
                      >
                        <option value="PENDING" className="bg-[#111] text-white">Pending</option>
                        <option value="PROCESSING" className="bg-[#111] text-white">Processing</option>
                        <option value="COMPLETED" className="bg-[#111] text-white">Completed</option>
                        <option value="REJECTED" className="bg-[#111] text-white">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => window.location.href = `mailto:${lead.email}?subject=Quotation for ${lead.companyName}`}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200 text-xs"
                          title="Send Email"
                        >
                          ✉️
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id, lead.fullName, lead.companyName)}
                          disabled={deletingId === lead.id}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 text-xs disabled:opacity-50"
                          title="Delete Lead"
                        >
                          {deletingId === lead.id ? '...' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leads.length === 0 && (
          <div className="text-center py-12 bg-[#111] border border-white/5 rounded-xl shadow-lg mt-6">
            <p className="text-gray-500">No leads yet. Share your quotation form to get started!</p>
          </div>
        )}
      </div>
      {/* Add Quotation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          {/* Modal */}
          <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-pink-500/5 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Request Quotation</h2>
              <p className="text-sm text-gray-400 mt-1">Manually add a new quotation request</p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={addFormData.fullName}
                  onChange={handleAddFormChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition-all duration-200 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={addFormData.contactNumber}
                  onChange={handleAddFormChange}
                  placeholder="9123456789 (min 10 digits)"
                  minLength={10}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition-all duration-200 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={addFormData.email}
                  onChange={handleAddFormChange}
                  placeholder="client@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition-all duration-200 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={addFormData.companyName}
                  onChange={handleAddFormChange}
                  placeholder="Company Inc."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition-all duration-200 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
              </div>

              {/* Inquiry */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Inquiry Details</label>
                <textarea
                  name="inquiry"
                  value={addFormData.inquiry}
                  onChange={handleAddFormChange}
                  rows={3}
                  placeholder="Describe the quotation request..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition-all duration-200 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAdd || isSendingEmail}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium text-sm hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingAdd ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Quotation'
                    )}
                  </button>
                </div>

                {/* Send Quotation Email Button - visible to all Sales/Admin users */}
                <button
                  type="button"
                  onClick={handleSendQuotationEmail}
                  disabled={isSendingEmail || isSubmittingAdd || !addFormData.email}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-blue-500/30 text-blue-400 font-medium text-sm hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-300 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSendingEmail ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      Send Quotation Request to Client
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  This will save the lead and send a quotation confirmation email to the client.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
