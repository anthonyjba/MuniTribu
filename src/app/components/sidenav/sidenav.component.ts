import { Component, Input, Output, EventEmitter, ElementRef , ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';

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
    keysSelected: {};

    @ViewChildren('optGroup', { read: ElementRef  }) optionsFilter : QueryList<AccordionPanelComponent>;

    @Output() newState = new EventEmitter();

    constructor(private elRef:ElementRef,
        private cdRef:ChangeDetectorRef) { }

    /*ngOnchange() {
        console.log( "! ngOnchange !" );
        //this.optionsFilter.changes.subscribe(() => console.log(this.optionsFilter));
    }

    ngAfterViewChecked(){
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
        
        let indice = this.items.findIndex((item) => item.id === toggle['id']);
        this.items[indice].display = toggle['display'];
        
        let firstItem = this.optionsFilter.first;
        firstItem.isOpen = true;

        //Valid n levels
        let n=0; this.items.forEach((e)=> { e.display? n++ : 0 });

        if(n===2){        
            //let tipoNivel2 = keys(this.items[indice].values)[0] // Deprecated            
            //this.currentState.filtroNivel2 = tipoNivel2;
            this.setKeysSelected();
        }
        else { this.currentState.filtroNivel2 = {}; }

        this._updateState(Cubo.ActionTypes.SWITCH_LEVEL_CUBO);
    }

    onClickAccordion(event) {
        let dictCurrent = {};


        dictCurrent = event.target.name === this.currentState.niveles[0] ? 
                        this.currentState.filtros : this.currentState.filtroNivel2;

        if (dictCurrent.hasOwnProperty(event.target.id)){
            delete dictCurrent[event.target.id];
        }
        else{
            dictCurrent[event.target.id] = 1;
        }
        
        this.items.find((col) => col.id === event.target.name).filters = dictCurrent;
        this.setKeysSelected();        
        this._updateState(Cubo.ActionTypes.FILTER_CUBO);

    }

    private _updateState(action) {
        let niveles = this.items.filter(f => f.display).map(c => c.id)

        this.currentState.niveles = niveles;
        this.newState.emit({ state: this.currentState, action: action });
    }

    private setKeysSelected(){
        this.keysSelected= Object.assign({}, this.currentState.filtros, this.currentState.filtroNivel2);
        /*if(this.currentState.filtroNivel2) {  //Old validation to one key filter
            this.keysSelected[this.currentState.filtroNivel2] = 1;
        }*/
    }

    activate(item: cuboState, columns) {
        this.currentState = INITIAL_STATE;
        this.currentState.id = item.id;
        this.currentState.gravamen = item.gravamen;
        this.currentState.filtros = item.filtros;
        this.currentState.filtroNivel2 = item.filtroNivel2;
        
        this.setKeysSelected();

        
        //Clone items level
        let clone = columns;
        clone.forEach(c => { c.display = false; c.filters = {}; });  

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
      
        this._updateState(Sidenav.ActionTypes.OPEN_SIDENAV); 

    }

    keys(items) {
        return keys(items) 
    }

}