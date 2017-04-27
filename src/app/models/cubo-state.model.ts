import { ICubo_Couta, IColumns } from '../shared/interfaces'

export interface cuboState {
  id: string,
  entities?: Array<ICubo_Couta>;
  niveles?: string[],
  series?: string[],
  filtros?: {},
  resumen?: {};
};

export const INITIAL_STATE: cuboState = {
  id: '',
  entities: [],
  niveles: [],
  series: [],
  filtros: {},
  resumen: {}
};