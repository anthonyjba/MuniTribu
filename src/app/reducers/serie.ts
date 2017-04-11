/*
{
    type: string,
    payload?: any
}
*/
import { ActionReducer, Action } from '@ngrx/store';


//export const serieReducer = (state = [], action: Action ) => {
export function serieReducer(state = [], action: Action): any {
    switch(action.type) {
        case "ADD_SERIE":
            return [
                ...state,
                action.payload
            ];
        case "REMOVE_SERIE":
            return state;
        default:
            return state;
    }
    
}

