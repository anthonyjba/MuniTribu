import { Action } from '@ngrx/store';
import { type } from '../shared/util';

export const ActionTypes = {
  OPEN_SIDENAV:   type('[SideNav] Open item'),
  CLOSE_SIDENAV:  type('[SideNav] Close item')
};


export class OpenSidenavAction implements Action {
  type = ActionTypes.OPEN_SIDENAV;
  constructor(public payload: string) { }
}

export class CloseSidenavAction implements Action {
  type = ActionTypes.CLOSE_SIDENAV;
  constructor(public payload: string) { }
}


export type Actions
  = OpenSidenavAction
  | CloseSidenavAction;
