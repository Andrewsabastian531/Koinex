import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { fetchHoldings, fetchCapitalGains } from '../api/mockApi';

const HarvestContext = createContext(null);

// ── Initial State ──────────────────────────────────────────────
const initialState = {
  holdings: [],
  capitalGains: null,
  selectedIds: new Set(),
  loadingHoldings: true,
  loadingGains: true,
  errorHoldings: null,
  errorGains: null,
};

// ── Reducer ────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload, loadingHoldings: false };
    case 'SET_GAINS':
      return { ...state, capitalGains: action.payload, loadingGains: false };
    case 'ERROR_HOLDINGS':
      return { ...state, errorHoldings: action.payload, loadingHoldings: false };
    case 'ERROR_GAINS':
      return { ...state, errorGains: action.payload, loadingGains: false };
    case 'TOGGLE_HOLDING': {
      const next = new Set(state.selectedIds);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, selectedIds: next };
    }
    case 'SELECT_ALL': {
      const allIds = new Set(action.payload);
      return { ...state, selectedIds: allIds };
    }
    case 'DESELECT_ALL':
      return { ...state, selectedIds: new Set() };
    default:
      return state;
  }
}

// ── Derived Computation ────────────────────────────────────────
function computeAfterHarvesting(capitalGains, holdings, selectedIds) {
  if (!capitalGains) return null;

  const base = capitalGains.capitalGains;
  let stcgProfits = base.stcg.profits;
  let stcgLosses = base.stcg.losses;
  let ltcgProfits = base.ltcg.profits;
  let ltcgLosses = base.ltcg.losses;

  selectedIds.forEach((id) => {
    const holding = holdings[id];
    if (!holding) return;

    const stcgGain = holding.stcg.gain;
    const ltcgGain = holding.ltcg.gain;

    // Short-term
    if (stcgGain > 0) stcgProfits += stcgGain;
    else if (stcgGain < 0) stcgLosses += Math.abs(stcgGain);

    // Long-term
    if (ltcgGain > 0) ltcgProfits += ltcgGain;
    else if (ltcgGain < 0) ltcgLosses += Math.abs(ltcgGain);
  });

  return {
    capitalGains: {
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses },
    }
  };
}

// ── Provider ───────────────────────────────────────────────────
export function HarvestProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load data on mount
  useEffect(() => {
    fetchHoldings()
      .then(data => dispatch({ type: 'SET_HOLDINGS', payload: data }))
      .catch(err => dispatch({ type: 'ERROR_HOLDINGS', payload: err.message }));

    fetchCapitalGains()
      .then(data => dispatch({ type: 'SET_GAINS', payload: data }))
      .catch(err => dispatch({ type: 'ERROR_GAINS', payload: err.message }));
  }, []);

  const toggleHolding = useCallback((index) => {
    dispatch({ type: 'TOGGLE_HOLDING', payload: index });
  }, []);

  const selectAll = useCallback((indices) => {
    dispatch({ type: 'SELECT_ALL', payload: indices });
  }, []);

  const deselectAll = useCallback(() => {
    dispatch({ type: 'DESELECT_ALL' });
  }, []);

  // Compute after-harvesting gains reactively
  const afterHarvestingGains = computeAfterHarvesting(
    state.capitalGains,
    state.holdings,
    state.selectedIds
  );

  const value = {
    ...state,
    afterHarvestingGains,
    toggleHolding,
    selectAll,
    deselectAll,
  };

  return (
    <HarvestContext.Provider value={value}>
      {children}
    </HarvestContext.Provider>
  );
}

export function useHarvest() {
  const ctx = useContext(HarvestContext);
  if (!ctx) throw new Error('useHarvest must be used within HarvestProvider');
  return ctx;
}
