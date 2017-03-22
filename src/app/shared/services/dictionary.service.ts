//App
import { dict_municipios, dict_cultivos } from '../static-data';
import { IMunicipio, IDefault } from '../interfaces'; 
import { Dictionary } from '../enums';


export function getDictionary(type: Dictionary){
    let DictionaryList: Array<IDefault> = [];
    let data: any;
    
    switch(type) {
        case Dictionary.Municipio:
            data = dict_municipios;
            break;
        case Dictionary.Cultivos:
            data = dict_cultivos;
            break;
    }

    for (var key in data) {
        DictionaryList.push({ id: key, name: data[key], selected : false }) 
    }
    return DictionaryList;
}


