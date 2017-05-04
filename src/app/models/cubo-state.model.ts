import { ICubo_Couta, IColumns } from '../shared/interfaces'

//entities?: Array<ICubo_Couta>; series?: string[],
export interface cuboState {
  id: string,  
  niveles?: string[],
  gravamen?: number,
  filtros?: {},
  resumen?: {};
};

export const INITIAL_STATE: cuboState = {
  id: '',
  niveles: [],
  gravamen: 0,
  filtros: {},
  resumen: {}
};