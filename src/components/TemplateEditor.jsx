import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import FormEditor from './FormEditor';

const TemplateEditor = ({ initialTemplate = null }) => {
  const [template, setTemplate] = useState(initialTemplate || {
    name: '',
    elements: [],
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

  const handleSaveTemplate = (updatedTemplate) => {
    saveTemplateMutation.mutate({ ...template, ...updatedTemplate });
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
      <FormEditor template={template} onSave={handleSaveTemplate} />
    </div>
  );
};

export default TemplateEditor;
