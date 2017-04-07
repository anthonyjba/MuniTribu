/*
{
    type: string,
    payload?: any
}
*/
import { ActionReducer, Action } from '@ngrx/store';

export const serieReducer = (state = [], action: Action ) => {
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