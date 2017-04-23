import { cuboState } from './cubo-state.model';

export interface CollectionStore {
  items: cuboState[];
  selectedItem: cuboState;
};