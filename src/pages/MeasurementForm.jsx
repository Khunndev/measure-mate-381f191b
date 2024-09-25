import React from 'react';
import MeasurementForm from '../components/MeasurementForm';

const MeasurementFormPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Measurement Form</h1>
      <MeasurementForm />
    </div>
  );
};

export default MeasurementFormPage;