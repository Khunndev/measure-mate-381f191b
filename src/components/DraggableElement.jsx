import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { X } from 'lucide-react';

const DraggableElement = ({ id, type, left, top, content, width, height, onMove, onUpdate, onRemove }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover(item, monitor) {
      if (item.id !== id) {
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (hoverClientY < hoverMiddleY) {
          onMove(id, item.left, item.top);
          onMove(item.id, left, top);
        }
      }
    },
  });

  drag(drop(ref));

  const handleContentChange = (e) => {
    onUpdate(id, { content: e.target.value });
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const elementStyle = {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  };

  const renderElement = () => {
    switch (type) {
      case 'LABEL':
        return <Textarea value={content} onChange={handleContentChange} className="w-full h-full resize-none" />;
      case 'TEXTBOX':
        return <Input value={content} onChange={handleContentChange} className="w-full h-full" />;
      case 'IMAGE':
        return <img src={content} alt="Uploaded" className="w-full h-full object-cover" />;
      default:
        return null;
    }
  };

  return (
    <div ref={ref} style={elementStyle} className="group">
      {renderElement()}
      <button
        onClick={handleRemove}
        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default DraggableElement;