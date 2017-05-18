import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { cuboState } from '../models/cubo-state.model';
import { type } from '../shared/util';


export const ActionTypes = {
  LOAD_CUBO:   type('[Cubo] Load item'),
  FILTER_CUBO: type('[Cubo] Filter value'),
  GRAVAMEN_CUBO: type('[Cubo] Change gravamen')
};

@Injectable()
export class CuboActions {
  constructor(private store: Store<cuboState>) {}

  public loadCubo(id: string, cubo, niveles: string[], gravamen: number, filtroNivel2: string, resumen) {
    //entities: [...cubo],

    let payload: cuboState = {
      id: id,       
      niveles: niveles,
      gravamen: gravamen,
      filtros: {},
      filtroNivel2: filtroNivel2, 
      resumen: resumen 
    };

    this.store.dispatch(
      { type: ActionTypes.LOAD_CUBO,
        payload: payload
      });
  }

  public filterCubo(id, filtros, resumen) {
    let payload: cuboState = {
      id: id,       
      filtros: filtros,
      resumen: resumen 
    };

    this.store.dispatch(
      { type: ActionTypes.FILTER_CUBO,
        payload: payload
      });

  }
  
  public gravamenCubo(id, gravamen, resumen) {
    let payload: cuboState = {
      id: id,       
      gravamen: gravamen,
      resumen: resumen 
    };

    this.store.dispatch(
      { type: ActionTypes.GRAVAMEN_CUBO,
        payload: payload
      });
  }

}