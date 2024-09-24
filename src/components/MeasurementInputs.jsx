import React from 'react';
import { Input } from '@/components/ui/input';

const MeasurementInputs = ({ section, measurements, handleInputChange }) => {
  const calculateAverage = () => {
    const values = measurements[section].filter(v => v !== '').map(Number);
    return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '0.00';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">Measurement Point {section}</h3>
      {measurements[section].map((value, index) => (
        <div key={index} className="flex items-center space-x-2">
          <label className="w-20 text-sm font-medium">Point {index + 1}</label>
          <Input
            type="text"
            inputMode="decimal"
            name={`${section}-${index}`}
            value={value}
            onChange={(e) => handleInputChange(section, index, e.target.value)}
            placeholder="Enter measurement"
            className="flex-grow"
          />
        </div>
      ))}
      <p className="text-lg font-semibold mt-2">
        Average: {calculateAverage()} mm
      </p>
    </div>
  );
};

export default MeasurementInputs;