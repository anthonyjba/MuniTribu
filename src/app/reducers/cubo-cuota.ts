import { ActionReducer } from '@ngrx/store'
import { ActionTypes } from '../actions/cubo-actions'

import { cuboState, INITIAL_STATE } from '../models/cubo-state.model';


export const cuboReducer: ActionReducer<cuboState> = (state = INITIAL_STATE, action) => {
//export function reducer(state = INITIAL_STATE, action: cubo.Actions) : State {
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

/*
export const chart1 = (state: chartCollection) => state.chart1;
export const chart2 = (state: chartCollection) => state.chart2;
*/