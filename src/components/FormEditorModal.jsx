import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormEditor from './FormEditor';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const FormEditorModal = ({ isOpen, onClose, template }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Template: {template?.name}</DialogTitle>
        </DialogHeader>
        <DndProvider backend={HTML5Backend}>
          <FormEditor template={template} />
        </DndProvider>
      </DialogContent>
    </Dialog>
  );
};

export default FormEditorModal;
