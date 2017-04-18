import { ICubo_Couta, IColumns } from '../shared/interfaces'

export interface cuboState {
  //ids: string[];
  entities: Array<ICubo_Couta> ;
  columnsGroup: Array<IColumns>;
  selectedCuboId: string | null;
};

export interface cuboCollection {
  chart1: { 
      cuboState : cuboState       
    }
}