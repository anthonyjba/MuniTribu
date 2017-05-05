import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';

import { cuboState, INITIAL_STATE } from '../../models/cubo-state.model'
import { IColumns, IDefault } from '../../shared/interfaces';
import { keys, type } from '../../shared/util';
import  * as Cubo from '../../actions/cubo-actions'
import * as Sidenav from '../../actions/sidenav-actions';
import { AccordionPanelComponent } from 'ng2-bootstrap';

@Component({
    selector: 'cat-sidenav',
    templateUrl: 'sidenav.component.html'
})
export class SidenavComponent {

    items: Array<any>;
    uniqueAccordion: boolean = true;
    currentState: cuboState;

    @ViewChildren('optGroup') optionsFilter : QueryList<AccordionPanelComponent>;
    /*isFirstOpen: boolean = false;

    set isFilterOpen(value: boolean){
        this.isFirstOpen = value;
        
    }

    get isFilterOpen() { return this.isFirstOpen; }*/

    @Output() newState = new EventEmitter();

    constructor(
        private cdRef:ChangeDetectorRef) { }

    ngOnchange() {
        console.log(this.optionsFilter);
        this.optionsFilter.changes.subscribe(() => console.log(this.optionsFilter));
    }

    /*ngAfterViewChecked(){
        console.log( "! ngAfterViewChecked !" );
    }

    ngOnChanges() {
        console.log( "! ngOnChanges !" );
    }
    
    ngDoCheck(){
        console.log( "! ngDoCheck !" );
    } 
    
    ngAfterContentChecked() {
        console.log( "! ngAfterContentChecked !" );
    }*/

    /** Events */
    onSortingItems(result: Array<any>) {
        if (result.length > 0) {
            this.items = result;
        }
    }

    onSwitchNiveles(toggle: Object) {
        /*this.items.forEach((item) => {
            if(item.id === toggle['id']) {
                item.display = !item.display;
            }
        });*/
        let reg = this.items.find((item) => item.id === toggle['id']);
        reg.display = toggle['display'];

        let firstItem = this.optionsFilter.first;   //.forEach((o,i) => { console.log(i); })
        firstItem.isOpen = true;
        //this._updateState(null);
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

        this._updateState(Cubo.ActionTypes.FILTER_CUBO);

    }

    private _updateState(action) {
        let niveles = this.items.filter(f => f.display).map(c => c.id)
        let filtros = this.items[0].filters;

        this.currentState.niveles = niveles;
        this.currentState.filtros = filtros;

        this.newState.emit({ state: this.currentState, action: action });
    }

    activate(item: cuboState, columns) {
        this.currentState = INITIAL_STATE;
        this.currentState.id = item.id;
        this.currentState.gravamen = item.gravamen;

        let clone = columns;
        clone.forEach(c => { c.display = false; c.filters = {}; });  

        let nivelTemp: Array<any> = [];
        item.niveles.forEach(element => {
            let indice = clone.findIndex(c => c.id === element);
            let currentItem = clone[indice];
            currentItem.display = true;
            let filtros = Object.getOwnPropertyNames(item.filtros);
            if(filtros.length > 0){
                currentItem.filters = item.filtros;                
                this.optionsFilter.changes.subscribe((allOptions) => 
                {
                    filtros.forEach((opt) => { 
                        let currentBtn = allOptions.find(x => x.nativeElement.id === opt)
                        currentBtn.nativeElement.classList.add("active-widget"); 
                    });
                });
                let allOptions = this.optionsFilter.toArray();
                
            }

            nivelTemp.push(currentItem);
            clone.splice(indice, 1);
        });

        clone.unshift(...nivelTemp);
        this.items = clone;

        this._updateState(Sidenav.ActionTypes.OPEN_SIDENAV); 

    }

    keys(items) {
        return keys(items)
    }

}