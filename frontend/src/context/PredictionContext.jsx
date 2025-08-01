import React, { createContext, useContext, useReducer } from 'react';

const PredictionContext = createContext();

const initialState = {
  predictions: [],
  currentPrediction: null,
  loading: false,
  error: null,
};

const predictionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PREDICTION':
      return { 
        ...state, 
        currentPrediction: action.payload,
        predictions: [...state.predictions, action.payload],
        loading: false 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const PredictionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(predictionReducer, initialState);

  const value = {
    ...state,
    dispatch,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within PredictionProvider');
  }
  return context;
};
