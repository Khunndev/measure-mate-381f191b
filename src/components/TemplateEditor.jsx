import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ImageUploader from './ImageUploader';
import DraggableTextbox from './DraggableTextbox';
import TemplatePreview from './TemplatePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const TemplateEditor = ({ initialTemplate = null }) => {
  const [template, setTemplate] = useState(initialTemplate || {
    name: '',
    image: null,
    textboxes: [],
  });
  const queryClient = useQueryClient();

  const saveTemplateMutation = useMutation({
    mutationFn: (newTemplate) => axios.post('/api/template/save', newTemplate),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template saved successfully');
    },
    onError: () => toast.error('Failed to save template'),
  });

  const handleImageUpload = useCallback((imagePath) => {
    setTemplate(prev => ({ ...prev, image: imagePath }));
  }, []);

  const handleImageDelete = useCallback(() => {
    setTemplate(prev => ({ ...prev, image: null }));
  }, []);

  const handleAddTextbox = useCallback(() => {
    setTemplate(prev => ({
      ...prev,
      textboxes: [...prev.textboxes, { id: Date.now(), label: 'New Textbox', x: 0, y: 0 }],
    }));
  }, []);

  const handleTextboxChange = useCallback((id, changes) => {
    setTemplate(prev => ({
      ...prev,
      textboxes: prev.textboxes.map(tb => tb.id === id ? { ...tb, ...changes } : tb),
    }));
  }, []);

  const handleTextboxDelete = useCallback((id) => {
    setTemplate(prev => ({
      ...prev,
      textboxes: prev.textboxes.filter(tb => tb.id !== id),
    }));
  }, []);

  const handleSaveTemplate = () => {
    saveTemplateMutation.mutate(template);
  };

  const handleResetTemplate = () => {
    setTemplate({
      name: '',
      image: null,
      textboxes: [],
    });
  };

  return (
    <div className="space-y-6">
      <Input
        type="text"
        value={template.name}
        onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Template Name"
        className="mb-4"
      />
      <ImageUploader
        currentImage={template.image}
        onUpload={handleImageUpload}
        onDelete={handleImageDelete}
      />
      <Button onClick={handleAddTextbox}>Add Textbox</Button>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          {template.textboxes.map((textbox) => (
            <DraggableTextbox
              key={textbox.id}
              {...textbox}
              onChange={(changes) => handleTextboxChange(textbox.id, changes)}
              onDelete={() => handleTextboxDelete(textbox.id)}
            />
          ))}
        </div>
        <TemplatePreview template={template} />
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleResetTemplate}>Reset Template</Button>
        <Button onClick={handleSaveTemplate}>Save Template</Button>
      </div>
    </div>
  );
};

export default TemplateEditor;