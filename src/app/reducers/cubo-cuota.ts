import { ActionReducer } from '@ngrx/store'
//import * as cubo from '../actions/cuboCollection';
import { ActionTypes } from '../actions/chart1-actions'

import { cuboState } from '../models/cubo-state';




const initialState: cuboState = {
  entities: [],
  niveles: [],
  series: [],
  resumen: {}
};

export const cuboReducer: ActionReducer<cuboState> = (state = initialState, action) => {
//export function reducer(state = initialState, action: cubo.Actions) : State {
    switch(action.type){
        case ActionTypes.LOAD_CUBO : {
            const newState = action.payload;

            return newState;
            }
        case ActionTypes.FILTER_CUBO: {
            const cubo = action.payload;
            const newCubo = cubo.filter(items => items["AC"]==="CON");

            return { 
                entities: [ ...newCubo ], //Object.assign({}, [ ...newCubo ]),
                selectedCuboId: "FILTRADO" 
                };
            }
        default:
            return state;
    }

}

export const getEntities = (state: cuboState) => state.entities;