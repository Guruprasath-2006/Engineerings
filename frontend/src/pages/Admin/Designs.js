import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiCheck, FiX, FiClock, FiUser, FiCalendar, FiDollarSign, FiBox, FiMessageSquare, FiFilter, FiSearch, FiArrowLeft } from 'react-icons/fi';

const AdminDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/designs/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDesigns(data.designs);
    } catch (error) {
      toast.error('Failed to fetch designs');
    } finally {
      setLoading(false);
    }
  };

  const updateDesignStatus = async (designId, status, note = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/designs/admin/${designId}/status`,
        { status, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Design ${status.toLowerCase()} successfully!`);
      fetchDesigns();
      setSelectedDesign(null);
      setReviewNote('');
    } catch (error) {
      toast.error('Failed to update design status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'gray',
      'Submitted': 'blue',
      'Under Review': 'yellow',
      'In Progress': 'purple',
      'Completed': 'green',
      'Cancelled': 'red'
    };
    return colors[status] || 'gray';
  };

  const filteredDesigns = designs.filter(design => {
    const matchesStatus = filterStatus === 'all' || design.status === filterStatus;
    const matchesSearch = design.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-luxury-lightGray/50 hover:bg-luxury-lightGray text-white rounded-lg transition-all duration-300 group"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiArrowLeft className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
          </motion.div>
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Design Projects</h1>
          <p className="text-gray-400">Review and manage all customer design submissions</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="luxury-card p-6 rounded-xl mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project name or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-luxury-darkGray text-white pl-12 pr-4 py-3 rounded-lg border border-primary-500/30 focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-luxury-darkGray text-white px-4 py-3 rounded-lg border border-primary-500/30 focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {['all', 'Submitted', 'Under Review', 'In Progress', 'Completed'].map(status => (
              <div key={status} className="text-center p-3 bg-luxury-darkGray rounded-lg">
                <div className="text-2xl font-bold text-primary-500">
                  {status === 'all' ? designs.length : designs.filter(d => d.status === status).length}
                </div>
                <div className="text-xs text-gray-400 mt-1">{status}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={design._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="luxury-card p-6 rounded-xl cursor-pointer"
              onClick={() => setSelectedDesign(design)}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(design.status)}-500/20 text-${getStatusColor(design.status)}-400 border border-${getStatusColor(design.status)}-500/30`}>
                  {design.status}
                </span>
                <span className="text-xs text-gray-500">#{design._id.slice(-6)}</span>
              </div>

              {/* Project Info */}
              <h3 className="text-lg font-bold text-white mb-2 truncate">{design.projectName}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {design.projectType} • {design.category}
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                <FiUser size={14} />
                <span>{design.user?.name || 'Unknown'}</span>
              </div>

              {/* Budget */}
              {design.budget && (
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                  <FiDollarSign size={14} />
                  <span>${design.budget.min?.toLocaleString()} - ${design.budget.max?.toLocaleString()}</span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FiCalendar size={12} />
                <span>{new Date(design.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-primary-500/20">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-all">
                  <FiEye size={16} />
                  <span>View Details</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No designs found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Design Detail Modal */}
      <AnimatePresence>
        {selectedDesign && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDesign(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-10 z-50 overflow-hidden"
            >
              <div className="h-full luxury-card rounded-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedDesign.projectName}</h2>
                    <p className="text-primary-100">Review & Manage Design Project</p>
                  </div>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="text-white hover:text-primary-100 p-2"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Project Details */}
                      <div className="bg-luxury-darkGray p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <FiBox className="text-primary-500" />
                          Project Details
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500">Project Type</label>
                            <p className="text-white">{selectedDesign.projectType}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Category</label>
                            <p className="text-white">{selectedDesign.category}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Building Type</label>
                            <p className="text-white">{selectedDesign.buildingType || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Description</label>
                            <p className="text-gray-300 text-sm">{selectedDesign.description || 'No description provided'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Specifications */}
                      <div className="bg-luxury-darkGray p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-4">Specifications</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500">Dimensions</label>
                            <p className="text-white">
                              {selectedDesign.specifications?.dimensions?.width} × {selectedDesign.specifications?.dimensions?.height}
                              {selectedDesign.specifications?.dimensions?.depth && ` × ${selectedDesign.specifications.dimensions.depth}`}
                              {' '}{selectedDesign.specifications?.dimensions?.unit || 'ft'}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Material</label>
                            <p className="text-white">{selectedDesign.specifications?.material || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Color</label>
                            <p className="text-white">{selectedDesign.specifications?.color || 'Not specified'}</p>
                          </div>
                          {selectedDesign.features?.length > 0 && (
                            <div>
                              <label className="text-xs text-gray-500">Features</label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedDesign.features.map((feature, i) => (
                                  <span key={i} className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div className="bg-luxury-darkGray p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <FiUser className="text-primary-500" />
                          Customer Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500">Name</label>
                            <p className="text-white">{selectedDesign.user?.name}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Email</label>
                            <p className="text-white">{selectedDesign.user?.email}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Phone</label>
                            <p className="text-white">{selectedDesign.user?.phone || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Budget & Timeline */}
                      <div className="bg-luxury-darkGray p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <FiDollarSign className="text-primary-500" />
                          Budget & Timeline
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500">Budget Range</label>
                            <p className="text-white">
                              ${selectedDesign.budget?.min?.toLocaleString()} - ${selectedDesign.budget?.max?.toLocaleString()}
                            </p>
                          </div>
                          {selectedDesign.timeline?.startDate && (
                            <div>
                              <label className="text-xs text-gray-500">Start Date</label>
                              <p className="text-white">{new Date(selectedDesign.timeline.startDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {selectedDesign.timeline?.endDate && (
                            <div>
                              <label className="text-xs text-gray-500">End Date</label>
                              <p className="text-white">{new Date(selectedDesign.timeline.endDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {selectedDesign.timeline?.duration && (
                            <div>
                              <label className="text-xs text-gray-500">Expected Duration</label>
                              <p className="text-white">{selectedDesign.timeline.duration}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Notes */}
                      <div className="bg-luxury-darkGray p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <FiMessageSquare className="text-primary-500" />
                          Review Notes
                        </h3>
                        <textarea
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                          placeholder="Add notes for the customer..."
                          className="w-full bg-luxury-black text-white px-4 py-3 rounded-lg border border-primary-500/30 focus:border-primary-500 focus:outline-none resize-none"
                          rows="4"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer - Action Buttons */}
                <div className="bg-luxury-darkGray p-6 border-t border-primary-500/20 flex flex-wrap gap-3 justify-end">
                  {selectedDesign.status === 'Submitted' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateDesignStatus(selectedDesign._id, 'Under Review', reviewNote)}
                      className="px-6 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all flex items-center gap-2"
                    >
                      <FiClock />
                      <span>Start Review</span>
                    </motion.button>
                  )}
                  
                  {(selectedDesign.status === 'Under Review' || selectedDesign.status === 'Submitted') && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateDesignStatus(selectedDesign._id, 'In Progress', reviewNote)}
                        className="px-6 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2"
                      >
                        <FiClock />
                        <span>Approve & Start</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateDesignStatus(selectedDesign._id, 'Cancelled', reviewNote)}
                        className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                      >
                        <FiX />
                        <span>Reject</span>
                      </motion.button>
                    </>
                  )}

                  {selectedDesign.status === 'In Progress' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateDesignStatus(selectedDesign._id, 'Completed', reviewNote)}
                      className="px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2"
                    >
                      <FiCheck />
                      <span>Mark Complete</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDesigns;
