import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const TraceabilityInspectorFields = ({ measurements, handleInputChange, errors, traceabilityInputRef, inspectorNameInputRef, onEnterPress }) => {
  const handleKeyDown = (field, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnterPress(field);
    }
  };

  const handleFocus = (field) => {
    handleInputChange(field, null, '');
  };

  return (
    <Card className="mb-6 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold">Traceability code</label>
            <Input
              type="text"
              name="traceabilityCode"
              value={measurements.traceabilityCode}
              onChange={(e) => handleInputChange('traceabilityCode', null, e.target.value)}
              onKeyDown={(e) => handleKeyDown('traceabilityCode', e)}
              onFocus={() => handleFocus('traceabilityCode')}
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
              onKeyDown={(e) => handleKeyDown('inspectorName', e)}
              onFocus={() => handleFocus('inspectorName')}
              placeholder="กรอกชื่อผู้ตรวจ"
              className={errors.inspectorName ? 'border-red-500' : ''}
              ref={inspectorNameInputRef}
            />
            {errors.inspectorName && <p className="text-red-500 text-sm">{errors.inspectorName}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraceabilityInspectorFields;
