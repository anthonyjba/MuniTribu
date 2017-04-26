import { createSelector } from 'reselect';
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
export const getSidenavState = (state) => state.Sidenav;

export const getSelectedItem = createSelector(getSidenavState, fromSideNav.getSelectedItem);

/**
 * Collection Charts 
 */
export const getItems = (state) => state.CollectionItems;

export const getSelected = createSelector(
  getItems,
  getSelectedItem,
  (entities, id) => entities.find(entities => entities.id === id)
);


