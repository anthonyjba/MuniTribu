import { Action } from '@ngrx/store';
import { type } from '../shared/util';

export const ActionTypes = {
  OPEN_SIDENAV:   type('[SideNav] Open'),
  CLOSE_SIDENAV:  type('[SideNav] Close')
};


export class OpenSidenavAction implements Action {
  type = ActionTypes.OPEN_SIDENAV;
}

export class CloseSidenavAction implements Action {
  type = ActionTypes.CLOSE_SIDENAV;
}


export type Actions
  = OpenSidenavAction
  | CloseSidenavAction;