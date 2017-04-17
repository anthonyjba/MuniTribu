//import { Action } from '@ngrx/store'
import * as cubo from '../actions/cuboCollection';

import { ICubo_Couta } from '../shared/interfaces'


export interface State {
  //ids: string[];
  entities: Array<ICubo_Couta> ;
  selectedCuboId: string | null;
};

const initialState: State = {
  //ids: [],
  entities: [],
  selectedCuboId: null
};


export function reducer(state = initialState, action: cubo.Actions) : State {
    switch(action.type){
        case cubo.ActionTypes.LOAD_CUBO : {
            const cubo = action.payload;
            console.log("Reducer");

            return  { 
                entities: [ ...cubo ],  //Object.assign({}, 
                selectedCuboId: "INI" 
                };
            }
        case "FITLERED": {
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

export const getEntities = (state: State) => state.entities;