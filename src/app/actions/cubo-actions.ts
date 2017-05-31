import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { cuboState } from '../models/cubo-state.model';
import { type } from '../shared/util';


export const ActionTypes = {
  LOAD_CUBO:   type('[Cubo] Load item'),
  FILTER_CUBO: type('[Cubo] Filter value'),
  GRAVAMEN_CUBO: type('[Cubo] Change gravamen'),
  SWITCH_LEVEL_CUBO: type('[Cubo] Switch Level')
};

@Injectable()
export class CuboActions {
  constructor(private store: Store<cuboState>) {}

  public loadCubo(id: string, niveles: string[], gravamen: number, filtroNivel2: any, resumen) {

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

  public filterCubo(id: string, filtros: any, filtroNivel2: any, resumen) {
    let payload: cuboState = {
      id: id,       
      filtros: filtros,
      filtroNivel2: filtroNivel2, 
      resumen: resumen 
    };

    this.store.dispatch(
      { type: ActionTypes.FILTER_CUBO,
        payload: payload
      });
  }
  
  public gravamenCubo(id: string, gravamen: number, resumen) {
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

  public switchLevelCubo(id: string, niveles: string[], filtroNivel2: any, resumen) {
    let payload: cuboState = {
      id: id,       
      niveles: niveles,
      filtroNivel2: filtroNivel2, 
      resumen: resumen 
    };

    this.store.dispatch(
      { type: ActionTypes.SWITCH_LEVEL_CUBO,
        payload: payload
      });
  }

}