import React from 'react';
import MeasurementForm from '../components/MeasurementForm';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">

          <MeasurementForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
