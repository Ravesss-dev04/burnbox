import { ArrowLeft, ArrowRight, Edit, Eye, Plus, Upload, X, Search, Filter, MoreVertical, Trash2, Image as ImageIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DarkModeServices {
  darkMode?: boolean
}

interface Service {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

const AdminServices: React.FC<DarkModeServices> = ({darkMode = false}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
    image: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsPerPage = 8;

  
   // Add edit function
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      price: service.price.toString(),
      description: service.description || '',
      image: null
    });
    setShowAddModal(true);
  };

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/sservices');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on search
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if(currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }

  const prevPage = () => {
    if(currentPage > 1) setCurrentPage((prev) => prev - 1 );
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewService(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  // Upload image
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const base64Content = base64.split(',')[1];

          const response = await fetch('https://burnbox.vercel.app/api/uploadimages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              images: [{
                name: file.name,
                content: base64Content
              }]
            }),
          });

          const result = await response.json();
          
          if (result.success && result.urls.length > 0) {
            resolve(result.urls[0]);
          } else {
            reject(new Error(result.message || 'Upload failed'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add new service
   const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      alert('Please fill all required fields');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = editingService?.imageUrl;

      // Upload new image if provided
      if (newService.image) {
        imageUrl = await uploadImage(newService.image);
      } else if (editingService) {
        // Keep existing image if not uploading new one
        imageUrl = editingService.imageUrl;
      }

      const url = editingService 
        ? `/api/sservices/${editingService.id}`
        : '/api/sservices';
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newService.name,
          price: parseFloat(newService.price),
          imageUrl: imageUrl,
          description: newService.description
        }),
      });

      if (response.ok) {
        const resultService = await response.json();
        
        if (editingService) {
          // Update existing service in state
          setServices(prev => prev.map(s => s.id === editingService.id ? resultService : s));
        } else {
          // Add new service to state
          setServices(prev => [resultService, ...prev]);
        }
        
        // Reset form and close modal
        setShowAddModal(false);
        setNewService({
          name: '',
          price: '',
          description: '',
          image: null
        });
        setEditingService(null);
        
        alert(editingService ? 'Service updated successfully!' : 'Service added successfully!');
      } else {
        throw new Error('Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // Update modal closing to reset edit state
  const closeModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setNewService({
      name: '',
      price: '',
      description: '',
      image: null
    });
  };
  // Delete service
  const handleDeleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/sservices/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setServices(prev => prev.filter(service => service.id !== id));
        alert('Service deleted successfully!');
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };
  
  if(loading) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-white'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-400">Loading Services...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide">
            Services Customization
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage your product catalog and pricing</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-pink-500/50 focus:outline-none transition-colors"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className='flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg shadow-pink-500/20'
          >
            <Plus size={18} /> <span className='text-sm font-semibold whitespace-nowrap'>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className='flex-1 bg-[#0a0a0a]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 overflow-y-auto'>
        {currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ImageIcon size={48} className="mb-4 opacity-20" />
            <p>No services found</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            <AnimatePresence>
              {currentItems.map((service) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={service.id}
                  className='group relative bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all duration-300 shadow-lg hover:shadow-pink-500/10'
                >
                  {/* Image Container */}
                  <div className="aspect-square relative bg-[#050505] p-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={service.imageUrl.split(',')[0]} 
                      alt={service.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditService(service);
                        }}
                        className='p-2 bg-white/10 hover:bg-blue-500 text-white rounded-lg transition-colors backdrop-blur-md'
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteService(service.id);
                        }}
                        className='p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-colors backdrop-blur-md'
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-[#151515] border-t border-white/5">
                    <h3 className="font-semibold text-white text-lg truncate mb-1" title={service.name}>
                      {service.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-pink-400 font-bold">
                        {service.price === 0 ? " " : ` ₱${service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                      </p>
                     
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-between items-center mt-8 pt-4 border-t border-white/5'>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className='flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
            >  
              <ArrowLeft size={18}/>
              <span className="text-sm font-medium">Previous</span>
            </button>
            
            <span className='text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full'>
              Page <span className="text-white font-medium">{currentPage}</span> of {totalPages}
            </span>
            
            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className='flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
            >
              <span className="text-sm font-medium">Next</span>
              <ArrowRight size={18} /> 
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              {/* Modal Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {editingService ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {editingService ? 'Update existing product details' : 'Create a new product listing'}
                    </p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Service Name <span className="text-pink-500">*</span></label>
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) => setNewService(prev => ({...prev, name: e.target.value}))}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-pink-500/50 focus:outline-none transition-colors placeholder-gray-600"
                      placeholder="e.g. Business Cards"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₱) <span className="text-pink-500">*</span></label>
                    <input
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService(prev => ({...prev, price: e.target.value}))}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-pink-500/50 focus:outline-none transition-colors placeholder-gray-600"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                    <textarea
                      value={newService.description}
                      onChange={(e) => setNewService(prev => ({...prev, description: e.target.value}))}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-pink-500/50 focus:outline-none transition-colors placeholder-gray-600 resize-none"
                      placeholder="Enter product description..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Product Image <span className="text-pink-500">{!editingService && '*'}</span>
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-pink-500/30 hover:bg-white/5 transition-all group cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="service-image"
                      />
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload size={20} className="text-gray-400 group-hover:text-pink-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                          {newService.image 
                            ? newService.image.name 
                            : editingService 
                              ? 'Click to replace image'
                              : 'Click to upload image'
                          }
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/5 mt-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-white/5 text-gray-300 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddService}
                      disabled={uploading || !newService.name || !newService.price || (!newService.image && !editingService)}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2.5 rounded-lg hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-500/20 font-medium"
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {editingService ? 'Saving...' : 'Adding...'}
                        </span>
                      ) : editingService ? (
                        'Save Changes'
                      ) : (
                        'Create Service'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminServices