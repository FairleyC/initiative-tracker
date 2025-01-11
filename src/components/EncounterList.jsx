import { useState, useEffect, useRef } from 'react';
import { PlusCircleIcon, TrashIcon, UserPlusIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Character from './Character';

const EncounterList = () => {
  const [encounters, setEncounters] = useState(() => {
    try {
      const savedEncounters = localStorage.getItem('encounters');
      return savedEncounters ? JSON.parse(savedEncounters) : [];
    } catch (error) {
      return [];
    }
  });
  const [lastAddedCharacterId, setLastAddedCharacterId] = useState(null);
  const [lastAddedEncounterId, setLastAddedEncounterId] = useState(null);
  const encounterNameRefs = useRef({});

  useEffect(() => {
    // Save encounters to localStorage whenever they change
    try {
      localStorage.setItem('encounters', JSON.stringify(encounters));
    } catch (error) {
      // Silently handle storage errors
    }
  }, [encounters]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '+') {
        if (event.ctrlKey) {
          // Add new encounter when Ctrl + "+" is pressed
          event.preventDefault();
          const newEncounterId = Date.now();
          addEncounter(newEncounterId);
        } else if (encounters.length > 0) {
          // Add character to the first encounter when only "+" is pressed
          const newCharacterId = Date.now();
          addCharacter(encounters[0].id, newCharacterId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [encounters]);

  useEffect(() => {
    // Focus the name input of the newly added encounter
    if (lastAddedEncounterId && encounterNameRefs.current[lastAddedEncounterId]) {
      encounterNameRefs.current[lastAddedEncounterId].focus();
      setLastAddedEncounterId(null);
    }
  }, [lastAddedEncounterId]);

  const addEncounter = (id = Date.now()) => {
    const newEncounter = {
      id,
      name: '',
      characters: []
    };
    setEncounters([newEncounter, ...encounters]);
    setLastAddedEncounterId(id);
  };

  const deleteEncounter = (id) => {
    setEncounters(encounters.filter(order => order.id !== id));
  };

  const updateEncounterName = (id, newName) => {
    setEncounters(encounters.map(order => 
      order.id === id ? { ...order, name: newName } : order
    ));
  };

  const addCharacter = (encounterId, characterId = Date.now()) => {
    const newCharacterId = characterId;
    setEncounters(prevOrders => {
      const newOrders = prevOrders.map(order => {
        if (order.id === encounterId) {
          return {
            ...order,
            characters: [...order.characters, {
              id: newCharacterId,
              name: '',
              initiative: ''
            }]
          };
        }
        return order;
      });
      return newOrders;
    });
    // Set the last added character ID after updating the orders
    setLastAddedCharacterId(newCharacterId);
  };

  const updateCharacter = (encounterId, character) => {
    setEncounters(encounters.map(order => {
      if (order.id === encounterId) {
        // Create a new array with the updated character
        const updatedCharacters = order.characters.map(c => 
          c.id === character.id ? character : c
        );
        
        // Sort characters by initiative while preserving order of equal values
        // by using the original array index as a secondary sort key
        const sortedCharacters = updatedCharacters
          .map((char, index) => ({ ...char, originalIndex: index }))
          .sort((a, b) => {
            if (b.initiative !== a.initiative) {
              return b.initiative - a.initiative;
            }
            return a.originalIndex - b.originalIndex;
          })
          .map(({ originalIndex, ...char }) => char);

        return {
          ...order,
          characters: sortedCharacters
        };
      }
      return order;
    }));
  };

  const deleteCharacter = (encounterId, characterId) => {
    setEncounters(encounters.map(order => {
      if (order.id === encounterId) {
        return {
          ...order,
          characters: order.characters.filter(c => c.id !== characterId)
        };
      }
      return order;
    }));
  };

  const shiftCharacter = (encounterId, characterId, direction) => {
    setEncounters(encounters.map(order => {
      if (order.id === encounterId) {
        const characters = [...order.characters];
        const index = characters.findIndex(c => c.id === characterId);
        if (direction === 'left' && index > 0) {
          [characters[index - 1], characters[index]] = [characters[index], characters[index - 1]];
        } else if (direction === 'right' && index < characters.length - 1) {
          [characters[index], characters[index + 1]] = [characters[index + 1], characters[index]];
        }
        return { ...order, characters };
      }
      return order;
    }));
  };

  const handleEncounterNameKeyDown = (e) => {
    if (e.key === '+') {
      e.preventDefault();
      // Don't return, let the event bubble up to the window handler
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#cccccc]">Encounters</h2>
        <button 
          onClick={() => addEncounter()}
          className="p-2 rounded-lg hover:bg-[#2a2d2e] transition-colors duration-200"
          title="Add Encounter (Ctrl + +)"
        >
          <PlusCircleIcon className="w-8 h-8 text-[#cccccc] hover:text-white" />
        </button>
      </div>
      
      <div className="space-y-6">
        {encounters.map(order => (
          <div key={order.id} className="border border-[#2d2d2d] bg-[#252526] p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <input
                ref={el => encounterNameRefs.current[order.id] = el}
                type="text"
                value={order.name}
                placeholder="Encounter Name"
                onChange={(e) => updateEncounterName(order.id, e.target.value)}
                onKeyDown={handleEncounterNameKeyDown}
                className="text-xl font-semibold bg-transparent border-b border-[#2d2d2d] focus:border-[#0e639c] outline-none text-[#cccccc]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => addCharacter(order.id)}
                  className="p-2 rounded-lg hover:bg-[#2a2d2e] transition-colors duration-200"
                  title="Add Character"
                >
                  <UserPlusIcon className="w-6 h-6 text-[#cccccc] hover:text-white" />
                </button>
                <button
                  onClick={() => deleteEncounter(order.id)}
                  className="p-2 rounded-lg hover:bg-[#2a2d2e] transition-colors duration-200"
                  title="Delete Encounter"
                >
                  <TrashIcon className="w-6 h-6 text-[#cccccc] hover:text-white" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-x-auto pb-2 -mx-4 px-4">
                <div className="flex gap-4 min-w-min">
                  {order.characters.map((character, index) => (
                    <div key={character.id} className="relative group">
                      <Character
                        character={character}
                        onUpdate={(updatedCharacter) => updateCharacter(order.id, updatedCharacter)}
                        onDelete={(characterId) => deleteCharacter(order.id, characterId)}
                        isNew={character.id === lastAddedCharacterId}
                      />
                      <div className="absolute left-0 bottom-0 p-1">
                        <button
                          onClick={() => shiftCharacter(order.id, character.id, 'left')}
                          disabled={index === 0}
                          className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#2a2d2e] transition-all duration-200 ${index === 0 ? 'cursor-not-allowed' : ''}`}
                          title="Move Left"
                        >
                          <ArrowLeftIcon className={`w-5 h-5 ${index === 0 ? 'text-[#858585]' : 'text-[#cccccc] hover:text-white'}`} />
                        </button>
                      </div>
                      <div className="absolute right-0 bottom-0 p-1">
                        <button
                          onClick={() => shiftCharacter(order.id, character.id, 'right')}
                          disabled={index === order.characters.length - 1}
                          className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#2a2d2e] transition-all duration-200 ${index === order.characters.length - 1 ? 'cursor-not-allowed' : ''}`}
                          title="Move Right"
                        >
                          <ArrowRightIcon className={`w-5 h-5 ${index === order.characters.length - 1 ? 'text-[#858585]' : 'text-[#cccccc] hover:text-white'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EncounterList; 