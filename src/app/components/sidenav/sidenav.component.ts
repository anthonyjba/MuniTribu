import { Component, Input, Output, EventEmitter } from '@angular/core';

import { cuboState, INITIAL_STATE } from '../../models/cubo-state.model'
import { IColumns, IDefault } from '../../shared/interfaces';
import { keys } from '../../shared/util';

@Component({
    selector: 'cat-sidenav',
    templateUrl: 'sidenav.component.html'
})
export class SidenavComponent {

    items: Array<any>;
    uniqueAccordion: boolean = true;
    currentState: cuboState;

    @Output() newState = new EventEmitter();

    constructor() { }

    /** Events */
    onSortingItems(result: Array<any>) {
        if (result.length > 0) {
            this.items = result;
        }
    }

    onSwitchNiveles(toggle: Object) {
        let reg = this.items.find((item) => item.id === toggle['id']);
        reg.display = toggle['display'];
        
        this._updateState();
    }

    onClickAccordion(event) {
        let dictCurrent = this.items.find((col) => col.id === event.target.name).filters;

        if (dictCurrent.hasOwnProperty(event.target.id)){
            delete dictCurrent[event.target.id];
            event.currentTarget.classList.remove("active-widget");
        }
        else{
            dictCurrent[event.target.id] = 1;
            event.currentTarget.classList.add("active-widget");
        }

        this._updateState();

    }

    private _updateState() {
        let niveles = this.items.filter(f => f.display).map(c => c.id)
        let filtros = this.items[0].filters;
        this.currentState.niveles = niveles;
        this.currentState.filtros = filtros;
        this.newState.emit(this.currentState);
    }

    activate(item: cuboState, columns) {
        this.currentState = INITIAL_STATE;
        this.currentState.id = item.id;

        let clone = columns;
        clone.forEach(c => { c.display = false;  });  //filters = false;

        let nivelTemp: Array<any> = [];
        item.niveles.forEach(element => {
            let indice = clone.findIndex(c => c.id === element);
            let currentItem = clone[indice];
            currentItem.display = true;
            nivelTemp.push(currentItem);
            clone.splice(indice, 1);
        });

        clone.unshift(...nivelTemp);
        this.items = clone;
        if(this.items.length > 0 && item.filtros)
            this.items[0].filters = item.filtros;

        this._updateState(); 

    }

    keys(items) {
        return keys(items)
    }

}