import { ActionReducer, Action } from '@ngrx/store';

import { ActionTypes } from '../actions/cubo-actions'
import { cuboState } from '../models/cubo-state.model';


export const collectionReducer: ActionReducer<cuboState[]> = (state = [], action) => {

  switch (action.type) {
    case ActionTypes.LOAD_CUBO:
      return [...state, action.payload];
    case ActionTypes.FILTER_CUBO: {
        return state.map(item => {
            if(item.id === action.payload.id){
              item.filtros = Object.assign({}, action.payload.filtros);
              item.filtroNivel2 = action.payload.filtroNivel2;
              item.resumen = action.payload.resumen;
            }
          return item;
        });         
      }
    case ActionTypes.GRAVAMEN_CUBO: {
        return state.map(item => {
            if(item.id === action.payload.id){
              item.gravamen = action.payload.gravamen;
              item.resumen = action.payload.resumen;
            }
          return item;
        });         
      }
    case ActionTypes.SWITCH_LEVEL_CUBO: {
        return state.map(item => {
            if(item.id === action.payload.id){
              item.niveles = action.payload.niveles;
              item.filtroNivel2 = action.payload.filtroNivel2;
              item.resumen = action.payload.resumen;
            }
          return item;
        });         
      }
    case ActionTypes.RESET_COLLECTION: {
      return [];
    }

    default:
      return state;    
  }
};
