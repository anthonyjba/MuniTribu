import * as sidenav from '../actions/sidenav-actions';


export interface State {
  showSidenav: boolean;
  selectedItem?: string;
}

const initialState: State = {
  showSidenav: false,
  selectedItem: null || ''
};

export function reducer(state = initialState, action: sidenav.Actions): State {
  switch (action.type) {
    case sidenav.ActionTypes.CLOSE_SIDENAV:
      return {
        showSidenav: false,
        selectedItem: action.payload
      };

    case sidenav.ActionTypes.OPEN_SIDENAV:
      return {
        showSidenav: true,
        selectedItem: action.payload
      };

    default:
      return state;
  }
}

export const getSelectedItem = (state: State) => state.selectedItem;