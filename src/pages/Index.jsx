import React from 'react';
import MeasurementForm from '../components/MeasurementForm';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow">
        <div className="relative h-[50vh] mb-12">
          <img 
            src="/hero-image.jpg" 
            alt="Precision Measurement" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white text-center">Precision Measurement</h1>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-center mb-16 text-gray-600">Experience the future of measurement with Measure Mate</p>
            <MeasurementForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
