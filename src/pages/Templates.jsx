import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TemplateManagement from '../components/TemplateManagement';
import TemplateEditor from '../components/TemplateEditor';
import { Button } from '@/components/ui/button';
import { fetchTemplates } from '../mockApi/mockApi';

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleCreateNewTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Template Management</h1>
      {isEditing ? (
        <TemplateEditor initialTemplate={selectedTemplate} />
      ) : (
        <>
          <Button onClick={handleCreateNewTemplate} className="mb-4">Create New Template</Button>
          <TemplateManagement templates={templates} onEditTemplate={handleEditTemplate} />
        </>
      )}
    </div>
  );
};

export default Templates;
