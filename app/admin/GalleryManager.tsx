'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, X, Trash2, Image as ImageIcon, Search, Loader2 } from 'lucide-react';

interface GalleryImage {
  id: number;
  imageUrl: string;
  title: string;
  altText: string;
  createdAt: string;
}

interface GalleryManagerProps {
    darkMode?: boolean
}

export default function GalleryManager({darkMode = false}: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch gallery images
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Upload images
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      // Convert files to base64
      const imagePromises = selectedFiles.map(file => {
        return new Promise<{ name: string; content: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            const base64Content = base64.split(',')[1];
            resolve({
              name: file.name,
              content: base64Content
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const imagesData = await Promise.all(imagePromises);

      // Upload to GitHub
      const uploadResponse = await fetch('/api/uploadimages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: imagesData }),
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        // Save to database
        for (const url of uploadResult.urls) {
          await fetch('/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl: url,
              title: '',
              altText: ''
            }),
          });
        }
        // Refresh gallery
        await fetchImages();
        setSelectedFiles([]);
        setShowUploadModal(false);
        alert('Images uploaded successfully!');
        
      } else {
        throw new Error(uploadResult.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(images.filter(img => img.id !== id));
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const filteredImages = images.filter(img => 
    img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.altText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-white'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-400">Loading Gallery...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide">
            Gallery Management
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage your gallery images and portfolio</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search images..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-pink-500/50 focus:outline-none transition-colors"
            />
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className='flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg shadow-pink-500/20'
          >
            <Plus size={18} /> <span className='text-sm font-semibold whitespace-nowrap'>Add Images</span>
          </button>
        </div>
        
      </div>

      {/* Gallery Grid */}
      <div className='flex-1 bg-[#0a0a0a]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 overflow-y-auto'>
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Current Gallery <span className="text-pink-500">({filteredImages.length})</span></h3>
        </div>

        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ImageIcon size={48} className="mb-4 opacity-20" />
            <p>No images found</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={image.id}
                  className='group relative bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all duration-300 shadow-lg hover:shadow-pink-500/10'
                >
                  {/* Image Container */}
                  <div className="aspect-video relative bg-[#050505] overflow-hidden">
                    <img 
                      src={image.imageUrl} 
                      alt={image.altText || 'Gallery Image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => handleDelete(image.id)}
                        className='p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-colors backdrop-blur-md'
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-[#151515] border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            {new Date(image.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                      
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
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
                    <h3 className="text-xl font-bold text-white">Add Images</h3>
                    <p className="text-sm text-gray-400 mt-1">Upload new photos to your gallery</p>
                  </div>
                  <button 
                    onClick={() => {
                        setShowUploadModal(false);
                        setSelectedFiles([]);
                    }}
                    className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Select Images
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-pink-500/30 hover:bg-white/5 transition-all group cursor-pointer relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload size={20} className="text-gray-400 group-hover:text-pink-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                          Click to upload images
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4 max-h-40 overflow-y-auto custom-scrollbar">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Selected Files ({selectedFiles.length})</h4>
                        <div className="space-y-2">
                            {selectedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs text-gray-400 bg-black/20 p-2 rounded">
                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                    <span className="text-gray-600">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-white/5 mt-2">
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedFiles([]);
                      }}
                      className="flex-1 bg-white/5 text-gray-300 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading || selectedFiles.length === 0}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2.5 rounded-lg hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-500/20 font-medium"
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`
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
  );
}