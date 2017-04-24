import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { cuboState } from '../../models/cubo-state.model'

@Component({
    selector: 'cat-sidenav',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'sidenav.component.html'
})
export class SidenavComponent {
    private _cs : cuboState = null; 

    @Input()
    Items: Array<any>;

    @Input()
    set currentState(data: cuboState) {
        debugger;
        this._cs = data;
    }
    get currentState(): cuboState { return this._cs; }

    constructor() {}    
}