import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ICubo_Couta } from '../interfaces';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class CuboCuotaService {
    result: Observable<Array<ICubo_Couta>>;

    constructor(private http: Http) {}

    getCubo(){
        return this.http.get('assets/data/cubo_cuota.json')
                        .map(res => res.json());
                        //.do(data => console.log(data))
    }

}