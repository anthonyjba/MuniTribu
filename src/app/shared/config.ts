import { IColumns, IDefault } from './interfaces';

export const COLUMNS_GROUP : Array<IColumns> = [
                  { id: 'TIPO_EXPLOTACION', name:'Explotación', display: false, values: {}, filters : {} },
                  { id: 'AC', name:'Cultivos', display: false, values: {}, filters : {} },
                  { id: 'IP', name:'IP', display: false, values: {}, filters : {} },
                  { id: 'EXENTO', name:'Exento', display: false, values: {}, filters : {} },
                  { id: 'BONIFICACION', name:'Bonificación', display: false, values: {}, filters : {} },
                  { id: 'TALLA', name:'Tamaño', display: false, values: {}, filters : {} },
                  { id: 'TIPO_CIF', name:'Titulares', display: false, values: {}, filters : {} },
                ];

export const COLUMNS_QUANTITY: Array<IDefault> = [
                  { id: 'N_SUBPARC', name:'#SubParcelas', color: '#3081EE' },
                  { id: 'N_PROPIETARIOS', name:'#Propietarios', color: '#9ecae1' },
                  { id: 'SUM_HECT', name:'€ Hectáreas', color: '#6baed6' },
                  { id: 'SUM_V_CATASTR', name:'€ V.Catatral', color: '#3182bd' },
                  { id: 'SUM_CUOTA', name:'€ Cuota', color: '#08519c' }
                  ];

export const COLORS_CHART: string[] = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
//#f7fbff,#deebf7,#c6dbef,#9ecae1,#6baed6,#4292c6,#2171b5,#08519c,#08306b
//"#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6"