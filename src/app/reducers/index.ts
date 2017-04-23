import { createSelector } from 'reselect';

//import * as fromCuboCuota from './cubo-cuota'

/*import { counterReducer } from './counter-reducer';
import { curseReducer } from './curse-reducer';
import { cuboReducer } from './cubo-cuota';
counter: counterReducer,
curse: curseReducer,
  */

import { ActionReducer, combineReducers } from '@ngrx/store';
import { collectionReducer } from './collection-reducer';
import * as fromSideNav from './sidenav-reducer';

const reducers = {
  Sidenav: fromSideNav.reducer,
  CollectionItems: collectionReducer
};

export default combineReducers(reducers);

/**
 * Layout Reducers
 */
export const getLayoutState = (state: fromSideNav.State) => state;

export const getShowSidenav = createSelector(getLayoutState, fromSideNav.getShowSidenav);



/*
export interface State {
  cubo: fromCuboCuota.State
}



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

