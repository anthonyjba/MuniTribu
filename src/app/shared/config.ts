import { IColumns, IDefault } from './interfaces';

export const Columns: Array<IColumns> = [
                  { id: 'AC', name:'Cultivo', display: true, values: {}, filters : {} }, 
                  { id: 'TIPO_CIF', name:'Propietario', display: false, values: {}, filters : {} },
                  { id: 'TALLA', name:'Tamaño', display: false, values: {}, filters : {} },
                  { id: 'IP', name:'IP', display: false, values: {}, filters : {} },
                  { id: 'IPP', name:'IPP', display: false, values: {}, filters : {} }
                ];

export const ColumnsQuantity: Array<IDefault> = [
                  { id: 'N_SUBPARC', name:'SubParcelas' },
                  { id: 'N_PROPIETARIOS', name:'Propietarios' },
                  { id: 'SUM_HECT', name:'Hectáreas' },
                  { id: 'SUM_V_CATASTR', name:'Valor Catastral' },
                  { id: 'SUM_CUOTA', name:'Cuota' }
                  ];

// 'AC','TIPO_CIF','TALLA','IP','IPP'];