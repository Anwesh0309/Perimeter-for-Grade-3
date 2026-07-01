import { createContext, useContext, useReducer, useEffect } from 'react';

const defaultState = {
  phaseStatus: { wonder: false, story: false, simulate: false, play: false, reflect: false },
  worlds: Object.fromEntries(
    Array.from({length:10},(_,i)=>[i+1,{unlocked:i===0,attempted:false,correctCount:0,starsEarned:0,questionsServed:[]}])
  ),
  xp: 0,
  streak: 0,
  maxStreak: 0,
  muted: false,
};

function reducer(state, action) {
  switch(action.type) {
    case 'COMPLETE_PHASE': {
      const next = {...state, phaseStatus:{...state.phaseStatus,[action.phase]:true}};
      // unlock next phase's required world
      return next;
    }
    case 'SET_MUTED':
      return {...state, muted: action.muted};
    case 'SUBMIT_ANSWER': {
      const { worldId, correct, xpEarned } = action;
      const w = state.worlds[worldId];
      const newCorrect = w.correctCount + (correct ? 1 : 0);
      const newStreak = correct ? state.streak + 1 : 0;
      const newMaxStreak = Math.max(state.maxStreak, newStreak);
      const stars = newCorrect >= 9 ? 3 : newCorrect >= 7 ? 2 : newCorrect >= 5 ? 1 : 0;
      return {
        ...state,
        xp: state.xp + (xpEarned||0),
        streak: newStreak,
        maxStreak: newMaxStreak,
        worlds: {
          ...state.worlds,
          [worldId]: { ...w, correctCount: newCorrect, starsEarned: stars }
        }
      };
    }
    case 'COMPLETE_WORLD': {
      const { worldId } = action;
      const nextId = worldId + 1;
      const newWorlds = { ...state.worlds,
        [worldId]: {...state.worlds[worldId], attempted:true},
      };
      if (nextId <= 10) newWorlds[nextId] = {...state.worlds[nextId], unlocked:true};
      return {...state, worlds: newWorlds, phaseStatus:{...state.phaseStatus, play:true}};
    }
    case 'RESET_WORLD': {
      return {
        ...state,
        worlds: {
          ...state.worlds,
          [action.worldId]: {...state.worlds[action.worldId], correctCount:0, questionsServed:[]}
        },
        streak: 0,
      };
    }
    case 'PLAY_AGAIN': {
      return {
        ...defaultState,
        muted: state.muted,
        worlds: Object.fromEntries(
          Array.from({length:10},(_,i)=>[i+1,{unlocked:i===0,attempted:false,correctCount:0,starsEarned:0,questionsServed:[]}])
        ),
      };
    }
    case 'LOAD':
      return action.state;
    default:
      return state;
  }
}

const GameStateContext = createContext(null);

export function GameStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState, (init) => {
    try {
      const saved = sessionStorage.getItem('perimeterQuestState');
      if (saved) return JSON.parse(saved);
    } catch {}
    return init;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('perimeterQuestState', JSON.stringify(state));
    } catch {}
  }, [state]);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  return useContext(GameStateContext);
}
