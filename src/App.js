import './App.css';
import { useReducer, useState } from 'react';

function App() {
  const [textarea, setTextarea] = useState('');

  function handleTextarea(event) {
    setTextarea(event.target.value);
  }

  const [checked, setChecked] = useState(false);

  function handleCheckbox() {
    setChecked(!checked);
  }

  const [radio, setRadio] = useState('linear');

  function handleRadio(event) {
    setRadio(event.target.value);
  }

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
        const maxIndex = state.participants.length - 1;
        const indexSum = radio === 'linear' ? maxIndex * (maxIndex + 1) / 2 :
                         radio === 'quadratic' ? maxIndex * (maxIndex + 1) * (2 * maxIndex + 1) / 6 :
                         (maxIndex * (maxIndex + 1) / 2) ** 2;
        let randomFromSum = Math.floor(Math.random() * indexSum) + 1;
        let i = 0;
        while (randomFromSum > 0) {
          i++;
          randomFromSum -= radio === 'linear' ? i :
                           radio === 'quadratic' ? i**2 :
                           i**3;
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

  function addProbToParticipants() {
    const maxIndex = state.participants.length - 1;
    const indexSum = radio === 'linear' ? maxIndex * (maxIndex + 1) / 2 :
                     radio === 'quadratic' ? maxIndex * (maxIndex + 1) * (2 * maxIndex + 1) / 6 :
                     (maxIndex * (maxIndex + 1) / 2) ** 2;
    const participantsWithProb = state.participants.map((participant, index) => {
      const numerator = radio === 'linear' ? index :
                        radio === 'quadratic' ? index**2 :
                        index**3;
      return `${participant} ${(numerator / indexSum * 100).toFixed(2)}%`
    });
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
      <div onChange={handleRadio}>
        distribution:
        <label>
          <input
            type="radio"
            name="dist"
            value="linear"
            checked={radio === 'linear'}
          />
          linear
        </label>
        <label>
          <input
            type="radio"
            name="dist"
            value="quadratic"
            checked={radio === 'quadratic'}
          />
          quadratic
        </label>
        <label>
          <input
            type="radio"
            name="dist"
            value="cubic"
            checked={radio === 'cubic'}
          />
          cubic
        </label>
      </div>
      <textarea value={textarea} onChange={handleTextarea} placeholder='Add participants, seperated with commas' />
      <button onClick={handleButtons}>Add</button>
    </div>
  );
}

export default App;
