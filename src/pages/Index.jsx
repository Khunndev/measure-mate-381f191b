import React from 'react';
import MeasurementForm from '../components/MeasurementForm';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-center mb-4 text-gray-600">Experience the future of measurement with Measure Mate</p>
          <p className="text-xl text-center mb-8 text-gray-600">สัมผัสประสบการณ์การวัดแห่งอนาคตกับ Measure Mate</p>
          <MeasurementForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
