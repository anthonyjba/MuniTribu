import { ActionReducer } from '@ngrx/store';
import { combineReducers } from '@ngrx/store';
import { createSelector } from 'reselect';

import * as fromCuboCuota from './cubo-cuota'

const reducers = {
  cubos: fromCuboCuota.reducer
};

export interface State {
  cuboMunicipio: fromCuboCuota.State
}


const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    return reducers;
}

export const getCuboMunicipio = (state: State) => state.cuboMunicipio;

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
 export const getCuboEntities = createSelector(getCuboMunicipio, fromCuboCuota.getEntities);

/*export const getCuboCollection = createSelector(getCuboEntities, (entities, ids) => {
  return ids.map(id => entities[id]);
});*/

