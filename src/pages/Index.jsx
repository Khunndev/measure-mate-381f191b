import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormEditor from '../components/FormEditor';

const Index = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Form Editor</h1>
        <FormEditor />
      </div>
    </DndProvider>
  );
};

export default Index;
