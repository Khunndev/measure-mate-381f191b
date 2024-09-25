import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import MeasurementInputs from './MeasurementInputs';
import MeasurementCard from './MeasurementCard';
import TraceabilityInspectorFields from './TraceabilityInspectorFields';
import { toast } from 'sonner';
import { saveMeasurement } from '../mockApi/mockApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';

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
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const traceabilityInputRef = useRef(null);
  const inspectorNameInputRef = useRef(null);
  const saveButtonRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5000/api/templates');
      return response.data;
    },
  });

  useEffect(() => {
    if (selectedTemplate) {
      // Here you would typically fetch the template details and update the form
      // For now, we'll just update the title
      setMeasurements(prevMeasurements => ({
        ...prevMeasurements,
        templateName: selectedTemplate.name
      }));
    }
  }, [selectedTemplate]);

  const saveMutation = useMutation({
    mutationFn: saveMeasurement,
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

  const handleEnterPress = (section) => {
    if (section === 'traceabilityCode') {
      inspectorNameInputRef.current?.focus();
    } else if (section === 'inspectorName') {
      document.querySelector('input[name="D1-0"]')?.focus();
    } else if (section === 'D1') {
      document.querySelector('input[name="D2-0"]')?.focus();
    } else if (section === 'D2') {
      saveButtonRef.current?.focus();
    }
  };

  const handleTemplateChange = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);
  };

  if (templatesLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">แบบฟอร์มตรวจสอบ - {measurements.templateName || 'Select a template'}</h2>
      
      <div className="mb-4">
        <Select onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates?.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TraceabilityInspectorFields
        measurements={measurements}
        handleInputChange={handleInputChange}
        errors={errors}
        traceabilityInputRef={traceabilityInputRef}
        inspectorNameInputRef={inspectorNameInputRef}
        onEnterPress={handleEnterPress}
      />
      <MeasurementCard
        onClear={handleClear}
        onSave={handleSave}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        confirmSave={confirmSave}
        saveButtonRef={saveButtonRef}
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
              onEnterPress={handleEnterPress}
            />
            <MeasurementInputs
              section="D2"
              measurements={measurements}
              handleInputChange={handleInputChange}
              errors={errors}
              onEnterPress={handleEnterPress}
            />
          </div>
        </div>
      </MeasurementCard>
    </div>
  );
};

export default MeasurementForm;
