//App
import { IDefault } from '../interfaces'; 
import { Dictionary } from '../enums';

import { MUNICIPIOS, CULTIVOS } from '../dictionary-data';


export function getDictionary(type: Dictionary){
    let DictionaryList: Array<IDefault> = [];
    let data: any;
    
    switch(type) {
        case Dictionary.Municipio:
            data = MUNICIPIOS;
            break;
        case Dictionary.Cultivos:
            data = CULTIVOS;
            break;
    }

    for (var key in data) {
        DictionaryList.push({ id: key, name: data[key] }) 
    }
    return DictionaryList;
}


