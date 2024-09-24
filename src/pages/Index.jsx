import React from 'react';
import MeasurementForm from '../components/MeasurementForm';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8">แบบฟอร์มบันทึกการวัด</h1>
        <MeasurementForm />
      </div>
    </div>
  );
};

export default Index;
