import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import DraggableElement from './DraggableElement';
import ControlPanel from './ControlPanel';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const FormEditor = () => {
  const [elements, setElements] = useState([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [, drop] = useDrop({
    accept: ['LABEL', 'TEXTBOX', 'IMAGE'],
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveElement(item.id, left, top);
      return undefined;
    },
  });

  const moveElement = useCallback((id, left, top) => {
    setElements(prevElements =>
      prevElements.map(el =>
        el.id === id ? { ...el, left, top } : el
      )
    );
  }, []);

  const addElement = (type) => {
    const newElement = {
      id: uuidv4(),
      type,
      left: 0,
      top: 0,
      content: type === 'LABEL' ? 'New Label' : '',
      width: type === 'IMAGE' ? 200 : 150,
      height: type === 'IMAGE' ? 200 : 30,
    };
    setElements(prevElements => [...prevElements, newElement]);
  };

  const updateElement = (id, updates) => {
    setElements(prevElements =>
      prevElements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      )
    );
  };

  const removeElement = (id) => {
    setElements(prevElements => prevElements.filter(el => el.id !== id));
  };

  const saveTemplateMutation = useMutation({
    mutationFn: (template) => axios.post('/api/template/save', template),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast({ title: 'Success', description: 'Template saved successfully' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to save template', variant: 'destructive' }),
  });

  const handleSave = () => {
    saveTemplateMutation.mutate({ elements });
  };

  const handleReset = () => {
    setElements([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <ControlPanel onAddElement={addElement} />
      <div className="flex-grow relative overflow-hidden" ref={drop}>
        <div className="absolute top-0 left-0 w-[210mm] h-[297mm] bg-white shadow-lg">
          {elements.map(element => (
            <DraggableElement
              key={element.id}
              {...element}
              onMove={moveElement}
              onUpdate={updateElement}
              onRemove={removeElement}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-4 p-4">
        <Button onClick={handleReset}>Reset Template</Button>
        <Button onClick={handleSave}>Save Template</Button>
      </div>
    </div>
  );
};

export default FormEditor;