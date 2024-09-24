import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MeasurementForm = () => {
  const [measurements, setMeasurements] = useState({
    traceabilityCode: '',
    D1: Array(4).fill(''),
    D2: Array(4).fill('')
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const saveButtonRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: savedMeasurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => JSON.parse(localStorage.getItem('measurements')) || { traceabilityCode: '', D1: Array(4).fill(''), D2: Array(4).fill('') },
  });

  useEffect(() => {
    if (savedMeasurements) {
      setMeasurements(savedMeasurements);
    }
  }, [savedMeasurements]);

  const saveMutation = useMutation({
    mutationFn: (newMeasurements) => {
      localStorage.setItem('measurements', JSON.stringify(newMeasurements));
      return newMeasurements;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['measurements']);
    },
  });

  const handleInputChange = (section, index, value) => {
    if (section === 'traceabilityCode') {
      setMeasurements(prev => ({ ...prev, traceabilityCode: value }));
    } else if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMeasurements(prev => ({
        ...prev,
        [section]: prev[section].map((v, i) => i === index ? value : v)
      }));
    }
  };

  const handleInputFocus = (section, index) => {
    if (section !== 'traceabilityCode') {
      setMeasurements(prev => ({
        ...prev,
        [section]: prev[section].map((v, i) => i === index ? '' : v)
      }));
    }
  };

  const handleKeyDown = (section, index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (section === 'D2' && index === 3) {
        saveButtonRef.current?.focus();
      } else if (section === 'traceabilityCode') {
        const nextInput = document.querySelector('input[name="D1-0"]');
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        const nextSection = section === 'D1' && index === 3 ? 'D2' : section;
        const nextIndex = (index + 1) % 4;
        const nextInput = document.querySelector(`input[name="${nextSection}-${nextIndex}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const calculateAverage = (section) => {
    const values = measurements[section].filter(v => v !== '').map(Number);
    return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '0.00';
  };

  const handleClear = () => {
    setMeasurements({ traceabilityCode: '', D1: Array(4).fill(''), D2: Array(4).fill('') });
  };

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    saveMutation.mutate(measurements);
    setShowConfirmDialog(false);
  };

  const renderMeasurementInputs = (section) => (
    <Card key={section}>
      <CardHeader>
        <CardTitle>จุดวัด {section}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {measurements[section].map((value, index) => (
            <div key={index} className="flex items-center space-x-2">
              <label className="w-20">จุดที่ {index + 1}</label>
              <Input
                type="text"
                inputMode="decimal"
                name={`${section}-${index}`}
                value={value}
                onChange={(e) => handleInputChange(section, index, e.target.value)}
                onFocus={() => handleInputFocus(section, index)}
                onKeyDown={(e) => handleKeyDown(section, index, e)}
                placeholder="Enter measurement"
                className="flex-grow"
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-lg font-semibold">
          เฉลี่ย: {calculateAverage(section)} mm
        </p>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <img src="/placeholder.svg" alt="Technical Drawing" className="w-full max-w-md mx-auto object-cover" />
      </div>
      <p className="text-center text-lg font-semibold">รูปชิ้นงาน</p>
      
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <label className="w-40">Traceability code</label>
              <Input
                type="text"
                name="traceabilityCode"
                value={measurements.traceabilityCode}
                onChange={(e) => handleInputChange('traceabilityCode', null, e.target.value)}
                onKeyDown={(e) => handleKeyDown('traceabilityCode', null, e)}
                placeholder="Enter traceability code"
                className="flex-grow"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-8">
          {['D1', 'D2'].map(renderMeasurementInputs)}
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={handleClear}>
          <Trash2 className="mr-2 h-4 w-4" /> ล้างค่า
        </Button>
        <Button onClick={handleSave} ref={saveButtonRef}>
          <Save className="mr-2 h-4 w-4" /> บันทึก
        </Button>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการบันทึก</AlertDialogTitle>
            <AlertDialogDescription>
              ต้องการบันทึกค่านี้ไหม?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeasurementForm;
