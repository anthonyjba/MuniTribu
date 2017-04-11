import { Action } from '@ngrx/store';
import { ICubo_Couta } from '../shared/interfaces';

export class LoadAction implements Action {
  type = "LOAD";

  constructor(public payload: Array<ICubo_Couta>) { }
}