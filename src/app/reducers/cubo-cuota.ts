import { ActionReducer } from '@ngrx/store'
//import * as cubo from '../actions/cuboCollection';
import { ActionTypes } from '../actions/chart1-actions'

import { cuboState } from '../models/cubo-state';




const initialState: cuboState = {
  //ids: [],
  entities: [{N_SUBPARC: 1,
    N_PROPIETARIOS: 100,
    SUM_HECT: 111,
    SUM_V_CATASTR: 645,
    TIPO_GRAVAMEN: 545,
    SUM_CUOTA: 5656}],
  columnsGroup: [],
  selectedCuboId: null
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