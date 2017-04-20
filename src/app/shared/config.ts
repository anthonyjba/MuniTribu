import { IColumns, IDefault } from './interfaces';

export const COLUMNS_GROUP : Array<IColumns> = [
                  { id: 'AC', name:'Cultivo', display: false, values: {}, filters : {} }, 
                  { id: 'TIPO_CIF', name:'Propietario', display: false, values: {}, filters : {} },
                  { id: 'TALLA', name:'Tamaño', display: false, values: {}, filters : {} },
                  { id: 'IP', name:'IP', display: false, values: {}, filters : {} },
                  { id: 'IPP', name:'IPP', display: false, values: {}, filters : {} }
                ];

export const COLUMNS_QUANTITY: Array<IDefault> = [
                  { id: 'N_SUBPARC', name:'#SubParcelas' },
                  { id: 'N_PROPIETARIOS', name:'#Propietarios' },
                  { id: 'SUM_HECT', name:'Hectáreas' },
                  { id: 'SUM_V_CATASTR', name:'Valor Catastral' },
                  { id: 'SUM_CUOTA', name:'Cuota' }
                  ];

export const COLUMNS_LEVEL : Array<IDefault> = [
                  { id: 'AC', name:'Cultivo' }, 
                  { id: 'TIPO_CIF', name:'Propietario' },
                  { id: 'TALLA', name:'Tamaño' },
                  { id: 'IP', name:'IP' },
                  { id: 'IPP', name:'IPP' }
                ];