import { ICubo_Couta, IColumns } from '../shared/interfaces'

export interface cuboState {
  id: string,
  entities: Array<ICubo_Couta>;
  niveles: string[],
  series: string[],
  resumen: {};
};


/*
export interface chartCollection {
      chart1 : cuboState,       
      chart2 : cuboState       
}
*/