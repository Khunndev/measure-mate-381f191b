import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Ruler, FileText, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ruler className="mr-2 h-6 w-6" />
            Measurement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Start a new measurement or continue an existing one.</p>
          <Button asChild>
            <Link to="/measurement">Go to Measurement</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Manage and create measurement templates.</p>
          <Button asChild>
            <Link to="/templates">Manage Templates</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-6 w-6" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Configure application settings and preferences.</p>
          <Button asChild>
            <Link to="/settings">Open Settings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
