import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

export const LOAD_CUBO = 'LOAD_CUBO';

@Injectable()
export class Char1Actions {
  constructor(private store: Store<any>) {}

  loadCubo() {
    this.store.dispatch({ type: LOAD_CUBO });
  }
}