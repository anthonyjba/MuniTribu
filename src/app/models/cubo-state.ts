import { ICubo_Couta, IColumns } from '../shared/interfaces'

export interface cuboState {
  //ids: string[];
  entities: Array<ICubo_Couta>;
  niveles: string[],
  series: string[],
  resumen: {};
  //selectedCuboId: string | null;
};

export interface chartCollection {
      chart1 : cuboState,       
      chart2 : cuboState       
}