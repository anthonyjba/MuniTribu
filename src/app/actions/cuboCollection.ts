import { Action } from '@ngrx/store';
import { ICubo_Couta } from '../shared/interfaces';
import { type } from '../shared/util';


export const ActionTypes = {
  LOAD_CUBO:   type('[Cubo] Load'),
  FILTER_CUBO: type('[Cubo] Filtered')
};

export class LoadCuboAction implements Action {
  type = ActionTypes.LOAD_CUBO;
  constructor(public payload: Array<ICubo_Couta>) { }
}

export class FilteredCuboAction implements Action {
  type = ActionTypes.FILTER_CUBO;
  constructor(public payload: Array<ICubo_Couta>) { }
}


export type Actions
  = LoadCuboAction
  | FilteredCuboAction;