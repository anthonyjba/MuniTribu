//import { Action } from '@ngrx/store'
import { LoadAction } from '../actions/cuboCollection';

import { ICubo_Couta } from '../shared/interfaces'


export interface State {
  //ids: string[];
  entities: { [id: string]: Array<ICubo_Couta> };
  selectedCuboId: string | null;
};

export const initialState: State = {
  //ids: [],
  entities: {},
  selectedCuboId: null,
};


export function reducer(state : State, action: LoadAction) : any {
    switch(action.type){
        case "LOAD":
            const cubocuota = action.payload;            
            return Object.assign({}, [ ...cubocuota ]);

        default:
            return state;
    }

}

export const getEntities = (state: State) => state.entities;