import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

const Character = ({ character, onUpdate, onDelete, isNew }) => {
  const [localInitiative, setLocalInitiative] = useState(character.initiative.toString());
  const initiativeInputRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    // Focus the initiative input if this is a new character
    if (isNew && initiativeInputRef.current) {
      // Use setTimeout to ensure the focus happens after the component is fully mounted
      setTimeout(() => {
        initiativeInputRef.current?.focus();
      }, 0);
    }
  }, [isNew]);

  const handleInitiativeChange = (e) => {
    const value = e.target.value;
    // Allow empty string or numbers only
    if (value === '' || /^-?\d*$/.test(value)) {
      setLocalInitiative(value);
    }
  };

  const handleInitiativeBlur = () => {
    const numericValue = parseInt(localInitiative) || 0;
    setLocalInitiative(numericValue.toString());
    if (numericValue !== character.initiative) {
      onUpdate({ ...character, initiative: numericValue });
    }
  };

  const handleInitiativeKeyDown = (e) => {
    if (e.key === '+') {
      e.preventDefault();
      // Don't return, let the event bubble up to the window handler
    }
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      nameInputRef.current?.focus();
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === '+') {
      e.preventDefault();
      // Don't return, let the event bubble up to the window handler
    }
  };

  return (
    <div className="w-40 h-40 flex flex-col bg-[#252526] rounded-lg p-4 relative group border border-[#2d2d2d]">
      <div className="flex items-center justify-between mb-2">
        <input
          ref={nameInputRef}
          type="text"
          value={character.name}
          onChange={(e) => onUpdate({ ...character, name: e.target.value })}
          onKeyDown={handleNameKeyDown}
          placeholder="Name"
          className="w-24 bg-transparent border-b border-[#2d2d2d] focus:border-[#0e639c] outline-none px-1 py-0.5 text-sm text-[#cccccc] placeholder-[#858585]"
        />
        <XMarkIcon 
          className="w-5 h-5 text-[#4d4d4d] hover:text-[#cccccc] transition-colors cursor-pointer" 
          onClick={() => onDelete(character.id)}
          title="Delete Character"
        />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center -mt-2">
        <div className="w-24 text-center">
          <span className="text-xs text-[#858585] block mb-1">Initiative</span>
          <input    
            ref={initiativeInputRef}
            type="text"
            inputMode="numeric"
            pattern="-?[0-9]*"
            value={localInitiative}
            onChange={handleInitiativeChange}
            onBlur={handleInitiativeBlur}
            onKeyDown={handleInitiativeKeyDown}
            className="w-full text-center bg-transparent outline-none px-2 py-1 text-4xl text-[#cccccc] placeholder-[#858585]"
          />
        </div>
      </div>
    </div>
  );
};

export default Character; 