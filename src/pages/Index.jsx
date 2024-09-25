import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MeasurementForm from '../components/MeasurementForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchTemplates } from '../mockApi/mockApi';

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });

  const handleTemplateChange = (templateId) => {
    const selected = templates.find(t => t.id === templateId);
    setSelectedTemplate(selected);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Measure Mate</h1>
          <p className="text-xl text-center mb-8 text-gray-600">Experience the future of measurement with Measure Mate</p>
          
          <div className="mb-6">
            <Select onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <MeasurementForm template={selectedTemplate} inspectorName={user?.username} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
