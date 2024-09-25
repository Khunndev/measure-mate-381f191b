import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';
import { deleteTemplate } from '../mockApi/mockApi';

const TemplateManagement = ({ templates, onEditTemplate }) => {
  const queryClient = useQueryClient();

  const deleteTemplateMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template deleted successfully');
    },
    onError: () => toast.error('Failed to delete template'),
  });

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteTemplateMutation.mutate(id);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Existing Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {templates?.map((template) => (
            <li key={template.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{template.name}</span>
              <div>
                <Button variant="ghost" size="sm" onClick={() => onEditTemplate(template)}>
                  <Edit className="h-4 w-4" />
                </Button>
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
