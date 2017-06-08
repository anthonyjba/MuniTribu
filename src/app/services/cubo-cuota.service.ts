import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { ICubo_Couta } from '../shared/interfaces';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';
import { decompressJson } from '../shared/util';


@Injectable()
export class CuboCuotaService {

    private DEFAULT_RESUMEN: ICubo_Couta = { COD_MUNICIPIO: null, 
              N_SUBPARC: 0, N_PROPIETARIOS: 0, SUM_HECT: 0, SUM_V_CATASTR: 0, TIPO_GRAVAMEN: 0, SUM_CUOTA: 0};

    constructor(private http: Http) { }

    getDefaultResumen() {
        return Object.assign({}, this.DEFAULT_RESUMEN ); 
    }

    getCubo(muni: string){
        return this.http.get('assets/data/cubo_cuota_toledo_c.json')
                        .map(res => decompressJson(res.json(), muni)) 
                        //.map(res => res.json());    //add res.json().items || []
                        //.do(data => console.log(data))        
    }

    getResumenMunicipio(cuboCuotaInicial, niveles) {

      let resumen; 
      for (var i = 0, j = cuboCuotaInicial.length; i !== j; i++) {
        let flag = true;
        for (var x = 0, y = niveles.length; x != y; x++){
          if(cuboCuotaInicial[i][niveles[x].id] !== null){
            flag = false;
            break;
            }
        }
        if(flag)
          resumen = Object.assign({}, cuboCuotaInicial[i]);
      }
      
      return resumen;
    }

    getCuboFiltrado(cuboMunicipio, columnsGroup, nivelesChart: string[]) {
      let result = [];
      
      for (var i = 0, j = cuboMunicipio.length; i !== j; i++) {
        let flag = false;
        for (var x = 0, y = columnsGroup.length; x != y; x++){
          if(
              (nivelesChart.indexOf(columnsGroup[x].id) === -1 ? 
                      cuboMunicipio[i][columnsGroup[x].id] === null :
                      cuboMunicipio[i][columnsGroup[x].id] !== null) 
                      &&
              (Object.getOwnPropertyNames(columnsGroup[x].filters).length === 0 || 
                columnsGroup[x].filters[cuboMunicipio[i][columnsGroup[x].id]])
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

      console.log(result);
      return result;
    }

}