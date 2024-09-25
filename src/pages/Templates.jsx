import React, { useState } from 'react';
import TemplateManagement from '../components/TemplateManagement';
import FormEditorModal from '../components/FormEditorModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Templates = () => {
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
  };

  const handleCloseModal = () => {
    setEditingTemplate(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Template Management</h1>
        <TemplateManagement onEditTemplate={handleEditTemplate} />
        <FormEditorModal
          isOpen={!!editingTemplate}
          onClose={handleCloseModal}
          template={editingTemplate}
        />
      </div>
    </DndProvider>
  );
};

export default Templates;
