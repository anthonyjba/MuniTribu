import { IColumns, IDefault } from './interfaces';

export const COLUMNS_GROUP : Array<IColumns> = [
                  { id: 'AC', name:'Cultivo', display: false, values: {}, filters : {} }, 
                  { id: 'TIPO_CIF', name:'Propietario', display: false, values: {}, filters : {} },
                  { id: 'TALLA', name:'Tamaño', display: false, values: {}, filters : {} },
                  { id: 'IP', name:'IP', display: false, values: {}, filters : {} },
                  { id: 'IPP', name:'IPP', display: false, values: {}, filters : {} }
                ];

export const COLUMNS_QUANTITY: Array<IDefault> = [
                  { id: 'N_SUBPARC', name:'#SubParcelas', color: '#3081EE' },
                  { id: 'N_PROPIETARIOS', name:'#Propietarios', color: '#9ecae1' },
                  { id: 'SUM_HECT', name:'€ Hectáreas', color: '#6baed6' },
                  { id: 'SUM_V_CATASTR', name:'€ V.Catatral', color: '#3182bd' },
                  { id: 'SUM_CUOTA', name:'€ Cuota', color: '#08519c' }
                  ];

export const COLUMNS_LEVEL : Array<IDefault> = [
                  { id: 'AC', name:'Cultivo' }, 
                  { id: 'TIPO_CIF', name:'Propietario' },
                  { id: 'TALLA', name:'Tamaño' },
                  { id: 'IP', name:'IP' },
                  { id: 'IPP', name:'IPP' }
                ];
