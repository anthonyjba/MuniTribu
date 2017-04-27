import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { cuboState } from '../models/cubo-state.model';
import { type } from '../shared/util';


export const ActionTypes = {
  LOAD_CUBO:   type('[Cubo] Load Item'),
  FILTER_CUBO: type('[Cubo] Filtered')
};

@Injectable()
export class CuboActions {
  constructor(private store: Store<cuboState>) {}

  public loadCubo(id, cubo, niveles, series, resumen) {

    let payload: cuboState = {
      id: id, 
      entities: [...cubo],
      niveles: niveles,
      series: series,
      filtros: {},
      resumen: resumen };

    this.store.dispatch(
      { type: ActionTypes.LOAD_CUBO,
        payload: payload
      });
  }
}