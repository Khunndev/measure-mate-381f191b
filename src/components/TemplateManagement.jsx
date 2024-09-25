import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const TemplateManagement = () => {
  const [newTemplateName, setNewTemplateName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => axios.get(`${API_URL}/templates`).then(res => res.data),
  });

  const createTemplateMutation = useMutation({
    mutationFn: (name) => axios.post(`${API_URL}/templates`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template created successfully');
      setNewTemplateName('');
    },
    onError: () => toast.error('Failed to create template'),
  });

  const updateTemplateMutation = useMutation({
    mutationFn: (template) => axios.put(`${API_URL}/templates/${template.id}`, template),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template updated successfully');
      setEditingTemplate(null);
    },
    onError: () => toast.error('Failed to update template'),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template deleted successfully');
    },
    onError: () => toast.error('Failed to delete template'),
  });

  const handleCreateTemplate = () => {
    if (newTemplateName.trim()) {
      createTemplateMutation.mutate(newTemplateName);
    }
  };

  const handleUpdateTemplate = () => {
    if (editingTemplate && editingTemplate.name.trim()) {
      updateTemplateMutation.mutate(editingTemplate);
    }
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteTemplateMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Template Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="New template name"
          />
          <Button onClick={handleCreateTemplate}>
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
        </div>
        <ul className="space-y-2">
          {templates?.map((template) => (
            <li key={template.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              {editingTemplate && editingTemplate.id === template.id ? (
                <Input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                />
              ) : (
                <span>{template.name}</span>
              )}
              <div>
                {editingTemplate && editingTemplate.id === template.id ? (
                  <Button variant="outline" size="sm" onClick={handleUpdateTemplate}>
                    Save
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TemplateManagement;
