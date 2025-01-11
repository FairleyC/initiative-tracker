import { useState, useEffect, useRef } from 'react';
import { PlusCircleIcon, TrashIcon, UserPlusIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Character from './Character';

const TurnOrderList = () => {
  const [turnOrders, setTurnOrders] = useState([]);
  const [lastAddedCharacterId, setLastAddedCharacterId] = useState(null);
  const [lastAddedTurnOrderId, setLastAddedTurnOrderId] = useState(null);
  const turnOrderNameRefs = useRef({});

  useEffect(() => {
    // Load turn orders from localStorage on component mount
    const savedTurnOrders = localStorage.getItem('turnOrders');
    if (savedTurnOrders) {
      setTurnOrders(JSON.parse(savedTurnOrders));
    }
  }, []);

  useEffect(() => {
    // Save turn orders to localStorage whenever they change
    localStorage.setItem('turnOrders', JSON.stringify(turnOrders));
  }, [turnOrders]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '+') {
        if (event.ctrlKey) {
          // Add new turn order when Ctrl + "+" is pressed
          event.preventDefault();
          const newTurnOrderId = Date.now();
          addTurnOrder(newTurnOrderId);
        } else if (turnOrders.length > 0) {
          // Add character to the first turn order when only "+" is pressed
          const newCharacterId = Date.now();
          addCharacter(turnOrders[0].id, newCharacterId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [turnOrders]);

  useEffect(() => {
    // Focus the name input of the newly added turn order
    if (lastAddedTurnOrderId && turnOrderNameRefs.current[lastAddedTurnOrderId]) {
      turnOrderNameRefs.current[lastAddedTurnOrderId].focus();
      setLastAddedTurnOrderId(null);
    }
  }, [lastAddedTurnOrderId]);

  const addTurnOrder = (id = Date.now()) => {
    const newTurnOrder = {
      id,
      name: '',
      characters: []
    };
    setTurnOrders([newTurnOrder, ...turnOrders]);
    setLastAddedTurnOrderId(id);
  };

  const deleteTurnOrder = (id) => {
    setTurnOrders(turnOrders.filter(order => order.id !== id));
  };

  const updateTurnOrderName = (id, newName) => {
    setTurnOrders(turnOrders.map(order => 
      order.id === id ? { ...order, name: newName } : order
    ));
  };

  const addCharacter = (turnOrderId, characterId = Date.now()) => {
    const newCharacterId = characterId;
    setTurnOrders(prevOrders => {
      const newOrders = prevOrders.map(order => {
        if (order.id === turnOrderId) {
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

  const updateCharacter = (turnOrderId, character) => {
    setTurnOrders(turnOrders.map(order => {
      if (order.id === turnOrderId) {
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

  const deleteCharacter = (turnOrderId, characterId) => {
    setTurnOrders(turnOrders.map(order => {
      if (order.id === turnOrderId) {
        return {
          ...order,
          characters: order.characters.filter(c => c.id !== characterId)
        };
      }
      return order;
    }));
  };

  const shiftCharacter = (turnOrderId, characterId, direction) => {
    setTurnOrders(turnOrders.map(order => {
      if (order.id === turnOrderId) {
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

  const handleTurnOrderNameKeyDown = (e) => {
    if (e.key === '+') {
      e.preventDefault();
      // Don't return, let the event bubble up to the window handler
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#cccccc]">Turn Orders</h2>
        <button 
          onClick={() => addTurnOrder()}
          className="p-2 rounded-lg hover:bg-[#2a2d2e] transition-colors duration-200"
          title="Add Turn Order (Ctrl + +)"
        >
          <PlusCircleIcon className="w-8 h-8 text-[#cccccc] hover:text-white" />
        </button>
      </div>
      
      <div className="space-y-6">
        {turnOrders.map(order => (
          <div key={order.id} className="border border-[#2d2d2d] bg-[#252526] p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <input
                ref={el => turnOrderNameRefs.current[order.id] = el}
                type="text"
                value={order.name}
                placeholder="Turn Order Name"
                onChange={(e) => updateTurnOrderName(order.id, e.target.value)}
                onKeyDown={handleTurnOrderNameKeyDown}
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
                  onClick={() => deleteTurnOrder(order.id)}
                  className="p-2 rounded-lg hover:bg-[#2a2d2e] transition-colors duration-200"
                  title="Delete Turn Order"
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

export default TurnOrderList; 