import React, { useState, useEffect } from 'react';
import { Trash2, Star, RefreshCw, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  rating: number | null;
  createdAt: string;
}

const FeedbackContent = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // Poll for new feedback every 30 seconds for "real-time" feel
    const interval = setInterval(fetchFeedbacks, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    setDeletingId(id);
    try {
      const response = await fetch(`/api/feedback?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
      } else {
        alert('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Error deleting feedback');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => 
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-pink-500" />
            Customer Feedback
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage and view feedback from your customers
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-pink-500 outline-none w-64 transition-colors"
            />
          </div>
          <button 
            onClick={fetchFeedbacks}
            className="p-2 bg-[#111] border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-pink-500 transition-all"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-pink-900/20 scrollbar-track-transparent">
        {loading && feedbacks.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>No feedback found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredFeedbacks.map((feedback) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#111] border border-white/5 rounded-xl p-5 hover:border-pink-500/30 transition-all group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center text-pink-500 font-bold text-lg">
                        {feedback.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{feedback.name}</h3>
                        <p className="text-xs text-gray-500">{feedback.email}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 bg-black/30 px-2 py-1 rounded-full">
                        {formatDate(feedback.createdAt)}
                      </div>
                    </div>

                    <div className="mt-3 pl-[52px]">
                      {feedback.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < feedback.rating! ? "fill-yellow-500 text-yellow-500" : "text-gray-700"} 
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {feedback.message}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(feedback.id)}
                    disabled={deletingId === feedback.id}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Feedback"
                  >
                    {deletingId === feedback.id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default FeedbackContent;
