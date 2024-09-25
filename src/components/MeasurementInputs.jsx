import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

const MeasurementInputs = ({ section, measurements, handleInputChange, errors, onEnterPress }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, measurements[section].length);
  }, [measurements, section]);

  const calculateAverage = () => {
    const values = measurements[section].filter(v => v !== '').map(Number);
    return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '0.00';
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < measurements[section].length - 1) {
        inputRefs.current[index + 1].focus();
      } else {
        onEnterPress(section);
      }
    }
  };

  const handleFocus = (index) => {
    handleInputChange(section, index, '');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">Measurement Point {section}</h3>
      {measurements[section].map((value, index) => (
        <div key={index} className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Point {index + 1}</label>
          <Input
            type="text"
            inputMode="decimal"
            name={`${section}-${index}`}
            value={value}
            onChange={(e) => handleInputChange(section, index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            placeholder="Enter measurement"
            className={errors[`${section}-${index}`] ? 'border-red-500' : ''}
            ref={el => inputRefs.current[index] = el}
          />
          {errors[`${section}-${index}`] && <p className="text-red-500 text-sm">{errors[`${section}-${index}`]}</p>}
        </div>
      ))}
      <p className="text-lg font-semibold mt-2">
        Average: {calculateAverage()} mm
      </p>
    </div>
  );
};

export default MeasurementInputs;
