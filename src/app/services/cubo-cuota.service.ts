import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import { Observable } from 'rxjs/Observable';

import { ICubo_Couta } from '../shared/interfaces';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';


@Injectable()
export class CuboCuotaService {
    //result: Observable<Array<ICubo_Couta>>;

    private DEFAULT_RESUMEN: ICubo_Couta = { MUNI: null, 
              N_SUBPARC: 0, N_PROPIETARIOS: 0, SUM_HECT: 0, SUM_V_CATASTR: 0, TIPO_GRAVAMEN: 0, SUM_CUOTA: 0};

    constructor(private http: Http) { }

    getDefaultResumen() {
        return Object.assign({}, this.DEFAULT_RESUMEN ); 
    }

    getCubo(){
        return this.http.get('assets/data/cubo_cuota.json')
                        .map(res => res.json());    //add res.json().items || []
                        //.do(data => console.log(data))
    }

    getCuboFiltrado(cuboMunicipio, niveles) {
    let result = [];
    
    for (var i = 0, j = cuboMunicipio.length; i !== j; i++) {
      let flag = false;
      for (var x = 0, y = niveles.length; x != y; x++){
        if(
            (niveles[x].display ? cuboMunicipio[i][niveles[x].id] !== null : cuboMunicipio[i][niveles[x].id] === null) &&
            (Object.getOwnPropertyNames(niveles[x].filters).length === 0 || 
              niveles[x].filters[cuboMunicipio[i][niveles[x].id]])
          )
          flag = true;
        else { 
          flag = false;
          break;
        }  
      }
      if(flag)
        result.push(cuboMunicipio[i]);
    }

    return result;
  }

}