import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MeasurementInputs from './MeasurementInputs';
import MeasurementCard from './MeasurementCard';
import TraceabilityInspectorFields from './TraceabilityInspectorFields';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

const initialMeasurements = {
  traceabilityCode: '',
  inspectorName: '',
  D1: Array(4).fill(''),
  D2: Array(4).fill('')
};

const MeasurementForm = () => {
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const traceabilityInputRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: savedMeasurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => JSON.parse(localStorage.getItem('measurements')) || initialMeasurements,
  });

  useEffect(() => {
    if (savedMeasurements) {
      setMeasurements(savedMeasurements);
    }
    traceabilityInputRef.current?.focus();
  }, [savedMeasurements]);

  const saveMutation = useMutation({
    mutationFn: async (newMeasurements) => {
      const response = await axios.post(`${API_URL}/measurements`, newMeasurements);
      localStorage.setItem('measurements', JSON.stringify(newMeasurements));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['measurements']);
      toast.success('Measurements saved successfully');
      setMeasurements(initialMeasurements);
      traceabilityInputRef.current?.focus();
    },
    onError: (error) => {
      console.error('Error saving measurements:', error);
      toast.error('ไม่สามารถบันทึกได้ !! กรุณาติดต่อพี่นึก');
    },
  });

  const validateInputs = () => {
    const newErrors = {};
    if (!measurements.traceabilityCode.trim()) {
      newErrors.traceabilityCode = 'Traceability code is required';
    }
    if (!measurements.inspectorName.trim()) {
      newErrors.inspectorName = 'Inspector name is required';
    }
    ['D1', 'D2'].forEach(section => {
      measurements[section].forEach((value, index) => {
        if (value && (isNaN(value) || value < 0)) {
          newErrors[`${section}-${index}`] = 'Must be a positive number';
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section, index, value) => {
    if (section === 'traceabilityCode' || section === 'inspectorName') {
      setMeasurements(prev => ({ ...prev, [section]: value }));
      setErrors(prev => ({ ...prev, [section]: '' }));
    } else if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMeasurements(prev => ({
        ...prev,
        [section]: prev[section].map((v, i) => i === index ? value : v)
      }));
      setErrors(prev => ({ ...prev, [`${section}-${index}`]: '' }));
    }
  };

  const handleClear = () => {
    setMeasurements(initialMeasurements);
    setErrors({});
    traceabilityInputRef.current?.focus();
  };

  const handleSave = () => {
    if (validateInputs()) {
      setShowConfirmDialog(true);
    }
  };

  const confirmSave = () => {
    saveMutation.mutate(measurements);
    setShowConfirmDialog(false);
  };

  return (
    <div className="space-y-6">
      <TraceabilityInspectorFields
        measurements={measurements}
        handleInputChange={handleInputChange}
        errors={errors}
        traceabilityInputRef={traceabilityInputRef}
      />
      <MeasurementCard
        onClear={handleClear}
        onSave={handleSave}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        confirmSave={confirmSave}
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">รูปชิ้นงาน</h3>
            <div className="flex items-center justify-center">
              <img 
                src="/FT.png" 
                alt="รูปตรวจชิ้นงาน" 
                className="w-full max-w-sm h-auto rounded-lg shadow-md object-cover mx-auto"
              />
            </div>
          </div>
          <div className="space-y-6">
            <MeasurementInputs
              section="D1"
              measurements={measurements}
              handleInputChange={handleInputChange}
              errors={errors}
            />
            <MeasurementInputs
              section="D2"
              measurements={measurements}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          </div>
        </div>
      </MeasurementCard>
    </div>
  );
};

export default MeasurementForm;
