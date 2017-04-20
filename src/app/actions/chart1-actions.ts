import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { cuboState } from '../models/cubo-state';
import { type } from '../shared/util';


export const ActionTypes = {
  LOAD_CUBO:   type('[Cubo] Load'),
  FILTER_CUBO: type('[Cubo] Filtered')
};

@Injectable()
export class Chart1Actions {
  constructor(private store: Store<cuboState>) {}

  public loadCubo(cubo, niveles, series, resumen) {

    let payload: cuboState = { 
      entities: [...cubo],
      niveles: niveles,
      series: series,
      resumen: resumen };

    this.store.dispatch(
      { type: ActionTypes.LOAD_CUBO,
        payload: payload
      });
  }
}