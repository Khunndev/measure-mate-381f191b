import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TemplateForm from '../components/TemplateForm';
import TemplateManagement from '../components/TemplateManagement';
import Navbar from '../components/Navbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [user, setUser] = useState(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => axios.get(`${API_URL}/templates`).then(res => res.data),
  });

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      axios.post(`${API_URL}/auth/google`, { code: codeResponse.code })
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          toast.success('Logged in successfully');
        })
        .catch(() => toast.error('Login failed'));
    },
    flow: 'auth-code',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Measure Mate</h1>
          <p className="text-xl text-center mb-8 text-gray-600">Experience the future of measurement with Measure Mate</p>
          
          {user ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <Select onValueChange={(value) => setSelectedTemplate(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleLogout}>Logout</Button>
              </div>
              {selectedTemplate ? (
                <TemplateForm templateId={selectedTemplate} onSave={() => setSelectedTemplate(null)} />
              ) : (
                <TemplateManagement />
              )}
            </>
          ) : (
            <div className="text-center">
              <Button onClick={() => login()}>Login with Google</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
