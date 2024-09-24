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

const API_URL = 'http://localhost:5000/api';

const MeasurementForm = () => {
  const [measurements, setMeasurements] = useState({
    traceabilityCode: '',
    inspectorName: '',
    D1: Array(4).fill(''),
    D2: Array(4).fill('')
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const saveButtonRef = useRef(null);
  const traceabilityInputRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: savedMeasurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => JSON.parse(localStorage.getItem('measurements')) || { traceabilityCode: '', inspectorName: '', D1: Array(4).fill(''), D2: Array(4).fill('') },
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
    },
    onError: (error) => {
      console.error('Error saving measurements:', error);
      toast.error('Failed to save measurements');
    },
  });

  const handleInputChange = (section, index, value) => {
    if (section === 'traceabilityCode' || section === 'inspectorName') {
      setMeasurements(prev => ({ ...prev, [section]: value }));
    } else if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMeasurements(prev => ({
        ...prev,
        [section]: prev[section].map((v, i) => i === index ? value : v)
      }));
    }
  };

  const handleClear = () => {
    setMeasurements({ traceabilityCode: '', inspectorName: '', D1: Array(4).fill(''), D2: Array(4).fill('') });
    traceabilityInputRef.current?.focus();
  };

  const handleSave = () => setShowConfirmDialog(true);

  const confirmSave = () => {
    saveMutation.mutate(measurements);
    setShowConfirmDialog(false);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-center mb-6">
          <img 
            src="/workpiece-image.jpg" 
            alt="ชิ้นงานที่ต้องวัด" 
            className="w-full max-w-md h-auto rounded-lg shadow-md mx-auto object-cover"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="w-40 text-lg font-semibold">Traceability code</label>
          <Input
            type="text"
            name="traceabilityCode"
            value={measurements.traceabilityCode}
            onChange={(e) => handleInputChange('traceabilityCode', null, e.target.value)}
            placeholder="Enter traceability code"
            className="flex-grow"
            ref={traceabilityInputRef}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-40 text-lg font-semibold">ชื่อผู้ตรวจ</label>
          <Input
            type="text"
            name="inspectorName"
            value={measurements.inspectorName}
            onChange={(e) => handleInputChange('inspectorName', null, e.target.value)}
            placeholder="กรอกชื่อผู้ตรวจ"
            className="flex-grow"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <MeasurementInputs
            section="D1"
            measurements={measurements}
            handleInputChange={handleInputChange}
          />
          <MeasurementInputs
            section="D2"
            measurements={measurements}
            handleInputChange={handleInputChange}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center space-x-4 p-6">
        <Button variant="outline" onClick={handleClear} className="w-32">
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
        <Button onClick={handleSave} ref={saveButtonRef} className="w-32 bg-primary hover:bg-primary-dark">
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
      </CardFooter>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these measurements?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MeasurementForm;
