import { ICubo_Couta, IColumns } from '../shared/interfaces'

export interface cuboState {
  //ids: string[];
  entities: Array<ICubo_Couta>;
  niveles: string[],
  series: string[],
  columnsGroup: Array<IColumns>;
  //selectedCuboId: string | null;
};

export interface cuboCollection {
  chart1: { 
      cuboState : cuboState       
    }
}