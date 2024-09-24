import React from 'react';
import MeasurementForm from '../components/MeasurementForm';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">แบบฟอร์มบันทึกการวัด</h1>
      <MeasurementForm />
    </div>
  );
};

export default Index;
