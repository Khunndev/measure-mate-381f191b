import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const MeasurementForm = () => {
  const [measurements, setMeasurements] = useState({
    D1: Array(4).fill(''),
    D2: Array(4).fill('')
  });

  const queryClient = useQueryClient();

  const { data: savedMeasurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => JSON.parse(localStorage.getItem('measurements')) || { D1: Array(4).fill(''), D2: Array(4).fill('') },
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
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMeasurements(prev => ({
        ...prev,
        [section]: prev[section].map((v, i) => i === index ? value : v)
      }));
    }
  };

  const calculateAverage = (section) => {
    const values = measurements[section].filter(v => v !== '').map(Number);
    return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '0.00';
  };

  const handleClear = () => {
    setMeasurements({ D1: Array(4).fill(''), D2: Array(4).fill('') });
  };

  const handleSave = () => {
    saveMutation.mutate(measurements);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <img src="/placeholder.svg" alt="Technical Drawing" className="w-full max-w-md mx-auto object-cover" />
      </div>
      <p className="text-center text-lg font-semibold">รูปชิ้นงาน</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {['D1', 'D2'].map((section) => (
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
                      value={value}
                      onChange={(e) => handleInputChange(section, index, e.target.value)}
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
        ))}
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={handleClear}>
          <Trash2 className="mr-2 h-4 w-4" /> ล้างค่า
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> บันทึก
        </Button>
      </div>
    </div>
  );
};

export default MeasurementForm;
