import React from 'react';
import { useDrop } from 'react-dnd';

const TemplatePreview = ({ template }) => {
  const [, drop] = useDrop({
    accept: 'textbox',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.x + delta.x);
      const top = Math.round(item.y + delta.y);
      moveTextbox(item.id, left, top);
      return undefined;
    },
  });

  const moveTextbox = (id, left, top) => {
    // Update the position of the textbox in the parent component
  };

  return (
    <div ref={drop} className="border rounded-lg p-4 min-h-[400px] relative">
      {template.image && (
        <img src={template.image} alt="Template" className="max-w-full h-auto" />
      )}
      {template.textboxes.map((textbox) => (
        <div
          key={textbox.id}
          style={{
            position: 'absolute',
            left: textbox.x,
            top: textbox.y,
          }}
        >
          {textbox.label}
        </div>
      ))}
    </div>
  );
};

export default TemplatePreview;