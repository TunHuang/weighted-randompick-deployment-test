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
        return { ...state, participants: [...state.participants, ...action.payload] };
      case 'clear':
        return { pick: '', participants: [] };
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
        return { pick: newPick, participants: newParticipants };
      case 'shuffle':
        const shuffled = [...state.participants];
        for (let i = shuffled.length - 1; i; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return { ...state, participants: shuffled };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const [textarea, setTextarea] = useState('');

  function handleChange(event) {
    setTextarea(event.target.value);
  }

  const [checked, setChecked] = useState(false);

  function handleCheckbox() {
    setChecked(!checked);
  }

  function addProbToParticipants() {
    const indexSum = (state.participants.length - 1) * state.participants.length / 2;
    const participantsWithProb = state.participants.map((participant, index) => `${participant} ${(index / indexSum * 100).toFixed(2)}%`);
    return participantsWithProb.join(', ');
  }

  function handleButtons(event) {
    const text = event.target.innerText.toLowerCase();
    if (text === 'add') {
      const newParticipants = textarea.split(',').map(item => item.trim());
      setTextarea('');
      dispatch({ type: text, payload: newParticipants });
    } else {
      dispatch({ type: text });
    }
  }

  return (
    <div className="App">
      <h1>Not so random picker</h1>
      <div className='queue'>
        {state.participants.length === 0 ? 'Add some participants' :
          checked ? addProbToParticipants() :
            state.participants.join(', ')}
      </div>
      <div className='queue'>
        <span>Pick: </span>{state.pick}
      </div>
      <div>
        <button onClick={handleButtons}>Clear</button>
        <button onClick={handleButtons}>Shuffle</button>
        <button onClick={handleButtons}>Pick</button>
        <label>
          show probabilities:
          <input type="checkbox" checked={checked} onChange={handleCheckbox} />
        </label>
      </div>
      <textarea value={textarea} onChange={handleChange} placeholder='Add participants, seperated with commas' />
      <button onClick={handleButtons}>Add</button>
    </div>
  );
}

export default App;
