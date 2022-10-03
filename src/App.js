import './App.css';
import { useReducer, useState, useEffect } from 'react';

function calcSum(n, order) {
  switch (order) {
    case 1:
      return n * (n + 1) / 2;
    case 2:
      return n * (n + 1) * (2 * n + 1) / 6;
    case 3:
      return (n * (n + 1) / 2) ** 2;
    default:
      throw new Error();
  }
}

function App() {
  const [textarea, setTextarea] = useState('');

  function handleTextarea(event) {
    setTextarea(event.target.value);
  }

  const [checked, setChecked] = useState(false);

  function handleCheckbox() {
    setChecked(checked => !checked);
  }

  const [radio, setRadio] = useState(() => {
    const radioFromLS = localStorage.getItem('radio');
    return radioFromLS ? +radioFromLS : 1;
  });
  
  function handleRadio(event) {
    setRadio(+event.target.value);
  }
  
  useEffect(() => {
    localStorage.setItem('radio', radio);
  }, [radio]);

  useEffect(() => {
    const participantsFromLS = localStorage.getItem('participants');
    if (participantsFromLS) {
      dispatch({ type: 'add', payload: JSON.parse(participantsFromLS) });
    }
  }, []);

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
        const indexSum = calcSum(maxIndex, radio);
        let randomFromSum = Math.floor(Math.random() * indexSum) + 1;
        let i = 0;
        while (randomFromSum > 0) {
          i++;
          randomFromSum -= i ** radio;
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

  useEffect(() => {
    const participantsString = JSON.stringify(state.participants);
    localStorage.setItem('participants', participantsString);
  }, [state]);

  function addProbToParticipants() {
    const maxIndex = state.participants.length - 1;
    const indexSum = calcSum(maxIndex, radio);
    const participantsWithProb = state.participants.map((participant, index) => {
      return `${participant} ${(index ** radio / indexSum * 100).toFixed(2)}%`
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
      <div className='pick'>
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
            value="1"
            checked={radio === 1}
          />
          linear
        </label>
        <label>
          <input
            type="radio"
            name="dist"
            value="2"
            checked={radio === 2}
          />
          quadratic
        </label>
        <label>
          <input
            type="radio"
            name="dist"
            value="3"
            checked={radio === 3}
          />
          cubic
        </label>
      </div>
      <textarea value={textarea} onChange={handleTextarea} placeholder='Add participants, seperated with commas' />
      <button onClick={handleButtons}>Add</button>
      <p>Descriptions and source on <a href="https://github.com/TunHuang/weighted-random-picker">Github</a></p>
    </div>
  );
}

export default App;
