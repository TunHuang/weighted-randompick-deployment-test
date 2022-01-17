import './App.css';
import { useReducer, useState } from 'react';

function App() {
  const initialState = {
    pick: '',
    participants: []
  };
  function reducer(state, action) {
    switch (action.type) {
      case 'add':
        return {...state, participants: [...state.participants, ...action.payload]};
      case 'clear':
        return {pick: '', participants: []};
      case 'pick':
        const indexSum = (state.participants.length - 1) * state.participants.length / 2;
        let randomFromSum = Math.floor(Math.random() * indexSum) + 1;
        let i = 0;
        while (randomFromSum > 0) {
          i++;
          randomFromSum -= i;
        }
        const newPick = state.participants[i];
        const newParticipants = [
          newPick,
          ...state.participants.slice(0, i),
          ...state.participants.slice(i + 1)
        ];
        return {pick: newPick, participants: newParticipants};
      case 'shuffle':
        const shuffled = [...state.participants];
        for (let i = shuffled.length - 1; i; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return {...state, participants: shuffled};
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  function handleClear() {
    dispatch({type: 'clear'});
  }

  function handleShuffle() {
    dispatch({type: 'shuffle'});
  }

  function handlePick() {
    dispatch({type: 'pick'});
  }

  const [textarea, setTextarea] = useState('');

  function handleChange(event) {
    setTextarea(event.target.value);
  }
  function handleAdd() {
    const newParticipants = textarea.split(',').map(item => item.trim());
    setTextarea('');
    dispatch({type: 'add', payload: newParticipants});
  } 
  return (
    <div className="App">
      <h1>Not so random picker</h1>
      <div className='queue'>
        {state.participants.length > 0 ?
          state.participants.join(', ') :
          'Add some participants'}
      </div>
      <div className='queue'>
        <span>Pick: </span>{state.pick}
      </div>
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleShuffle}>Shuffle</button>
      <button onClick={handlePick}>Pick</button>
      <textarea value={textarea} onChange={handleChange} />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default App;
