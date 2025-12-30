import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

const MyDesigns = () => {
  const { user } = useContext(AuthContext);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/designs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDesigns(data.designs);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load designs');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/designs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Design deleted successfully');
        fetchDesigns();
      } catch (error) {
        toast.error('Failed to delete design');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-500',
      'Submitted': 'bg-blue-500',
      'Under Review': 'bg-yellow-500',
      'In Progress': 'bg-orange-500',
      'Completed': 'bg-green-500',
      'Cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-2">
              My Designs
            </h1>
            <p className="text-gray-400 text-lg">Manage your custom engineering projects</p>
          </div>
          <Link to="/design-studio">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-black font-bold rounded-lg flex items-center space-x-2"
            >
              <FiPlus />
              <span>New Design</span>
            </motion.button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : designs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl mb-6">You haven't created any designs yet</p>
            <Link to="/design-studio">
              <button className="px-8 py-3 gold-glow-btn text-black font-bold rounded-lg">
                Create Your First Design
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design, index) => (
              <motion.div
                key={design._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="luxury-card rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{design.projectName}</h3>
                      <p className="text-primary-500 text-sm">{design.projectType}</p>
                    </div>
                    <span className={`${getStatusColor(design.status)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {design.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white">{design.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Building:</span>
                      <span className="text-white">{design.buildingType}</span>
                    </div>
                    {design.estimatedCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Estimated Cost:</span>
                        <span className="text-primary-500 font-semibold">${design.estimatedCost}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">{new Date(design.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {design.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {design.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Link to={`/designs/${design._id}`} className="flex-1">
                      <button className="w-full px-4 py-2 bg-luxury-darkGray text-white rounded-lg hover:bg-primary-500/20 transition-all flex items-center justify-center space-x-2">
                        <FiEye />
                        <span>View</span>
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(design._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDesigns;


