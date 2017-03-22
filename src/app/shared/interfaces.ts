
export interface IDefault {
    id: string,
    name: string
    selected: boolean
}

export interface IColumns {
    id: string,
    name?: string,
    display?: boolean,
    filters?: {};
}

export interface IMunicipio {
    id: string,
    name: string
}

export interface ICubo_Couta {
    MUNI: string,
    AC: string,
    IP: number,
    IPP: number,
    TALLA: string
    TIPO_CIF: string,
    N_SUBPARC: number,
    N_PROPIETARIOS: number,
    SUM_HECT: number,
    SUM_V_CATASTR: number,
    TIPO_GRAVAMEN: number,
    SUM_CUOTA: number
}