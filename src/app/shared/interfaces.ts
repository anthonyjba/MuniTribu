
export interface IDefault {
    id: string,
    name: string,
    color?: string
}

export interface IColumns {
    id: string,
    name?: string,
    display?: boolean,
    values?: {},
    filters?: {};
}

export interface ICubo_Couta {
    /*MUNI?: string,
    AC?: string,
    IP?: number,
    IPP?: number,
    TALLA?: string
    TIPO_CIF?: string,
    N_SUBPARC: number,
    N_PROPIETARIOS: number,
    SUM_HECT: number,
    SUM_V_CATASTR: number,
    TIPO_GRAVAMEN: number,
    SUM_CUOTA: number*/
    COD_MUNICIPIO?: string,
    TIPO_EXPLOTACION?: string,
    AC?: string,
    IP?: number,
    EXENTO?: string,
    BONIFICACION?: string,
    TALLA?: string,
    TIPO_CIF?: string,
    N_SUBPARC: number,
    N_PROPIETARIOS: number,
    SUM_HECT: number,
    SUM_V_CATASTR: number,
    TIPO_GRAVAMEN: number,
    SUM_CUOTA: number
}

