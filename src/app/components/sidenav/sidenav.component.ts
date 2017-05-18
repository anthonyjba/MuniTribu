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
    //keysFiltro: Observable<string> = undefined;

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
        /*this.items.forEach((item) => {
            if(item.id === toggle['id']) {
                item.display = !item.display;
            }
        });*/
        //let n=0; this.sortItems.forEach((e)=> { e.display? n++ : 0 });
        let indice = this.items.findIndex((item) => item.id === toggle['id']);
        this.items[indice].display = toggle['display'];
        //let reg = this.items.find((item) => item.id === toggle['id']);
        //reg.display = toggle['display'];

        let firstItem = this.optionsFilter.first;
        firstItem.isOpen = true;
        
        let tipoNivel2 = keys(this.items[indice].values)[0]
        let currentButton = document.getElementById(tipoNivel2);
        currentButton.classList.add("active-widget")


        this._updateState(Cubo.ActionTypes.FILTER_CUBO);
    }

    onClickAccordion(event) {
        //let dictCurrent = this.items.find((col) => col.id === event.target.name).filters;
        let dictCurrent = this.currentState.filtros;

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
        //let filtros = this.items[0].filters;

        this.currentState.niveles = niveles;
        //this.currentState.filtros = filtros;

        this.newState.emit({ state: this.currentState, action: action });
    }

    activate(item: cuboState, columns) {
        this.currentState = INITIAL_STATE;
        this.currentState.id = item.id;
        this.currentState.gravamen = item.gravamen;
        this.currentState.filtros = item.filtros;
        this.currentState.filtroNivel2 = item.filtroNivel2;

        //Clone items level
        let clone = columns;
        clone.forEach(c => { c.display = false; c.filters = {}; });  

        let nivelTemp: Array<any> = [];
        item.niveles.forEach(element => {
            let indice = clone.findIndex(c => c.id === element);
            let currentItem = clone[indice];
            currentItem.display = true;
            /*let filtros = Object.getOwnPropertyNames(item.filtros);
            if(filtros.length > 0){
                currentItem.filters = item.filtros;
                debugger;                
                this.optionsFilter.changes.subscribe((allOptions) => 
                {                    
                    filtros.forEach((opt) => { 
                        let currentBtn = allOptions.find(x => x.nativeElement.id === opt)
                        currentBtn.nativeElement.classList.add("active-widget"); 
                    });

                    
                    if(item.filtroNivel2) {
                        let currentBtn = allOptions.find(x => x.nativeElement.id === item.filtroNivel2)
                        currentBtn.nativeElement.classList.add("active-widget");
                    }
                    
                });
                //let allOptions = this.optionsFilter.toArray();
                
            }*/

            nivelTemp.push(currentItem);
            clone.splice(indice, 1);
        });

        //console.log(nivelTemp);
        clone.unshift(...nivelTemp);
        this.items = clone;

        //this.optionsFilter. .do(d => { console.log("activate open"); })
        
        //this.optionsFilter.changes.subscribe((allOptions) => {
        
        
        
        let filtros = Object.getOwnPropertyNames(this.currentState.filtros);
        if(filtros.length > 0){
            filtros.forEach((opt) => { console.log(opt) });
        }

        if(this.currentState.filtroNivel2) {
            let currentBtn = document.getElementById(this.currentState.filtroNivel2);
            console.log(currentBtn);
            //currentBtn.classList.add("active-widget");
        }

            //});

        

        this._updateState(Sidenav.ActionTypes.OPEN_SIDENAV); 

    }

    keys(items) {
        return keys(items) 
    }

}