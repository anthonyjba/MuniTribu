import { ActionReducer, combineReducers } from '@ngrx/store';
import { createSelector } from 'reselect';

//import * as fromCuboCuota from './cubo-cuota'

import { counterReducer } from './counter-reducer';
import { curseReducer } from './curse-reducer';
import { cuboReducer, chart1 } from './cubo-cuota';

export default combineReducers({
  counter: counterReducer,
  curse: curseReducer,
  chart1: cuboReducer 
});


/*
export interface State {
  cubo: fromCuboCuota.State
}

const reducers = {
  cubo: fromCuboCuota.reducer
};

const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    return productionReducer(state, action);
}

export const getCuboMunicipio = (state: State) => state.cubo;

export const getItems = fromCuboCuota.getEntities;*/

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function from the reselect library creates
 * very efficient selectors that are memoized and only recompute when arguments change.
 * The created selectors can also be composed together to select different
 * pieces of state.
 */
 //export const getCuboEntities = createSelector(getCuboMunicipio, fromCuboCuota.getEntities);

/*export const getCuboCollection = createSelector(getCuboEntities, (entities, ids) => {
  return ids.map(id => entities[id]);
});*/

