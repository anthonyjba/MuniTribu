import { ActionReducer, Action } from '@ngrx/store';

import { INITIAL_STATE as CUBO_INITIAL_STATE } from './cubo-cuota';

const INITIAL_STATE = [
  CUBO_INITIAL_STATE,
  CUBO_INITIAL_STATE,
  CUBO_INITIAL_STATE
]


export const collectionReducer: ActionReducer<any> = (state = 0, action) => state