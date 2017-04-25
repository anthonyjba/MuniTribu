import * as layout from '../actions/sidenav-actions';


export interface State {
  showSidenav: boolean;
  selectedItem?: string;
}

const initialState: State = {
  showSidenav: false,
  selectedItem: null || ''
};

export function reducer(state = initialState, action: layout.Actions): State {
  switch (action.type) {
    case layout.ActionTypes.CLOSE_SIDENAV:
      return {
        showSidenav: false
      };

    case layout.ActionTypes.OPEN_SIDENAV:
      return {
        showSidenav: true,
        selectedItem: action.payload
      };

    default:
      return state;
  }
}

export const getSelectedItem = (state: State) => state.selectedItem;