import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Eye, Download, Image as ImageIcon, Video, FileText, Calendar } from 'lucide-react';
import { Media as MediaType } from '../types';
import api from '../services/api';

const Media: React.FC = () => {
  const [media, setMedia] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('general');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, [filters]);

  const loadMedia = async () => {
    try {
      const data = await api.getMedia(filters.category || undefined);
      let filteredData = data;

      if (filters.type) {
        filteredData = filteredData.filter(item => item.type === filters.type);
      }

      setMedia(filteredData);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await api.uploadFile(selectedFile, uploadCategory);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      await loadMedia();
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadCategory('general');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await api.deleteMedia(id);
        await loadMedia();
      } catch (error) {
        console.error('Failed to delete media:', error);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-red-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading media...</div>
      </div>
    );
  }

  //

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your media files and assets
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="product">Product</option>
              <option value="news">News</option>
              <option value="service">Service</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* */}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {media.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {item.type === 'image' ? (
                <img
                  src={item.cloudinaryUrl || item.url || item.fileUrl || api.getFileUrl(item.id)}
                  alt={item.originalName}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error('Image load error');
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const sibling = e.currentTarget.nextElementSibling as (HTMLElement | null);
                    if (sibling) sibling.style.display = 'flex';
                  }}
                />
              ) : item.type === 'video' ? (
                <video
                  src={item.cloudinaryUrl || item.url || item.fileUrl || api.getFileUrl(item.id)}
                  className="w-full h-48 object-cover"
                  controls
                  onError={(e) => {
                    console.error('Video load error');
                    (e.currentTarget as HTMLVideoElement).style.display = 'none';
                    const sibling = (e.currentTarget as HTMLVideoElement).nextElementSibling as (HTMLElement | null);
                    if (sibling) sibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-48 flex items-center justify-center bg-gray-100" style={{display: item.type === 'image' || item.type === 'video' ? 'none' : 'flex'}}>
                {getFileIcon(item.type)}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.originalName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(item.size)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.type.toUpperCase()}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <a
                    href={item.fileUrl}
                    download
                    className="text-gray-400 hover:text-gray-600"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span className="inline-flex px-2 py-1 rounded-full bg-gray-100">
                  {item.category}
                </span>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(item.createdAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No media files</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading a new file.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
            >
              Upload File
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload File</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setUploadCategory('general');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="general">General</option>
                    <option value="product">Product</option>
                    <option value="news">News</option>
                    <option value="service">Service</option>
                  </select>
                </div>

                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                      setUploadCategory('general');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="btn btn-secondary"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!selectedFile || uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
