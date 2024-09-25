import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import MeasurementInputs from './MeasurementInputs';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = 'http://172.28.119.10:3334/api';

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const saveButtonRef = useRef(null);
  const traceabilityInputRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setIsSubmitting(true);
      try {
        const response = await axios.post(`${API_URL}/measurements`, newMeasurements);
        localStorage.setItem('measurements', JSON.stringify(newMeasurements));
        return response.data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['measurements']);
      localStorage.removeItem('measurements');

      toast.success('บันทึกสำเร็จแล้ว !!');

      // Briefly show success feedback
      setShowSuccess(true);

      // Clear form fields and reset errors
      setMeasurements(initialMeasurements);
      setErrors({});

      traceabilityInputRef.current?.focus();

      setTimeout(() => setShowSuccess(false), 1000);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Adjust the delay as needed
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
    localStorage.removeItem('measurements');
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
    <Card className="shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 lg:pr-4 mb-6 lg:mb-0">
            <h3 className="text-xl font-semibold mb-4 text-center">รูปชิ้นงาน</h3>
            <div className="flex items-center justify-center">
              <img 
                src="/FT.png" 
                alt="รูปตรวจชิ้นงาน" 
                className="w-full max-w-sm h-auto rounded-lg shadow-md object-cover mx-auto"
              />
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-4 space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-lg font-semibold">Traceability code</label>
              <Input
                type="text"
                name="traceabilityCode"
                value={measurements.traceabilityCode}
                onChange={(e) => handleInputChange('traceabilityCode', null, e.target.value)}
                placeholder="Enter traceability code"
                className={errors.traceabilityCode ? 'border-red-500' : ''}
                ref={traceabilityInputRef}
              />
              {errors.traceabilityCode && <p className="text-red-500 text-sm">{errors.traceabilityCode}</p>}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-lg font-semibold">ชื่อผู้ตรวจ</label>
              <Input
                type="text"
                name="inspectorName"
                value={measurements.inspectorName}
                onChange={(e) => handleInputChange('inspectorName', null, e.target.value)}
                placeholder="กรอกชื่อผู้ตรวจ"
                className={errors.inspectorName ? 'border-red-500' : ''}
              />
              {errors.inspectorName && <p className="text-red-500 text-sm">{errors.inspectorName}</p>}
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
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center space-x-4 p-4 sm:p-6">
        <Button variant="outline" onClick={handleClear} className="w-full sm:w-32">
          <Trash2 className="mr-2 h-4 w-4" /> ยกเลิก
        </Button>
        <Button
          onClick={handleSave}
          ref={saveButtonRef}
          className={`w-full sm:w-32 bg-primary hover:bg-primary-dark
                      ${showSuccess ? 'bg-green-500 transition-colors duration-300 ease-in-out' : ''}
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting} // Disable button during submission
        >
          {isSubmitting ? 'Saving...' : ( // Show loading indicator during submission
            <>
              <Save className="mr-2 h-4 w-4" /> บันทึก
            </>
          )}
        </Button>
      </CardFooter>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการที่จะบันทึกข้อมูลหรือไม่ ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>บันทึก</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MeasurementForm;
