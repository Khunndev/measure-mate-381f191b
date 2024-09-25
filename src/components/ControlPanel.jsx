import React from 'react';
import { Button } from './ui/button';
import { Upload, Type, Square } from 'lucide-react';

const ControlPanel = ({ onAddElement }) => {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-100">
      <Button onClick={() => onAddElement('LABEL')} className="flex items-center">
        <Type className="mr-2" size={16} />
        Add Label
      </Button>
      <Button onClick={() => onAddElement('TEXTBOX')} className="flex items-center">
        <Square className="mr-2" size={16} />
        Add Textbox
      </Button>
      <Button onClick={() => onAddElement('IMAGE')} className="flex items-center">
        <Upload className="mr-2" size={16} />
        Add Image
      </Button>
    </div>
  );
};

export default ControlPanel;