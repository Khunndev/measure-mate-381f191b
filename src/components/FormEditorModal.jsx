import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormEditor from './FormEditor';

const FormEditorModal = ({ isOpen, onClose, template }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Template: {template?.name}</DialogTitle>
        </DialogHeader>
        <FormEditor template={template} />
      </DialogContent>
    </Dialog>
  );
};

export default FormEditorModal;