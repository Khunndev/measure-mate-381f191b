import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
import axios from 'axios';

const ImageUploader = ({ currentImage, onUpload, onDelete }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await axios.post('/api/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onUpload(response.data.imagePath);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
      }
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative">
          <img src={currentImage} alt="Template" className="max-w-full h-auto rounded-lg" />
          <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive ? 'border-primary' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Drag and drop an image here, or click to select a file</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;