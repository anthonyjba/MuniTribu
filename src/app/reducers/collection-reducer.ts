import { ActionReducer, Action } from '@ngrx/store';

import { ActionTypes } from '../actions/cubo-actions'
import { cuboState } from '../models/cubo-state.model';

export const collectionReducer: ActionReducer<cuboState[]> = (state = [], action) => {
  switch (action.type) {
    //case 'ADD_ITEMS':
    //  return action.payload;
    case ActionTypes.LOAD_CUBO:
      return [...state, action.payload];
    /*case 'UPDATE_ITEM':
      return state.map(item => {
        return item.id === payload.id ? Object.assign({}, item, payload) : item;
      });
    case 'DELETE_ITEM':
      return state.filter(item => {
        return item.id !== payload.id;
      });*/
    default:
      return state;
  }
};
