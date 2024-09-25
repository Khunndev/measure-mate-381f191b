import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const DraggableTextbox = ({ id, label, x, y, onChange, onDelete }) => {
  const [, drag] = useDrag({
    type: 'textbox',
    item: { id, label, x, y },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleLabelChange = (e) => {
    onChange({ label: e.target.value });
  };

  return (
    <div ref={drag} style={{ position: 'absolute', left: x, top: y }} className="cursor-move">
      {isEditing ? (
        <Input
          type="text"
          value={label}
          onChange={handleLabelChange}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <div className="flex items-center space-x-2">
          <span onClick={() => setIsEditing(true)}>{label}</span>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DraggableTextbox;