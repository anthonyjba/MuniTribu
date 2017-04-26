import { Component, Input } from '@angular/core';

import { cuboState } from '../../models/cubo-state.model'
import { IColumns, IDefault } from '../../shared/interfaces';
import { keys } from '../../shared/util';

@Component({
    selector: 'cat-sidenav',
    templateUrl: 'sidenav.component.html'
})
export class SidenavComponent {

    items: Array<any>;
    uniqueAccordion: boolean = true;

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
    }

    activate(item: cuboState, columns) {
        let clone = columns;
        clone.forEach(c => c.display = false);

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
    }

    keys(items) {
        return keys(items)
    }

}