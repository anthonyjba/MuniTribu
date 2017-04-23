import { Component, ChangeDetectionStrategy, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ChartComponent } from '../components/chart/chart.component';
import { CuboActions } from '../actions/cubo-actions'
import * as Sidenav from '../actions/sidenav-actions';

import { Counter } from '../components/counter-component';
import { CounterActions } from '../actions/counter-actions';
import { CurseActions } from '../actions/curse-actions';

import * as fromRoot from '../reducers';

import { cuboState } from '../models/cubo-state.model'

import { CuboCuotaService } from '../services/cubo-cuota.service';
import { COLUMNS_QUANTITY  } from '../shared/config';
import { IColumns, IDefault } from '../shared/interfaces';

@Component({
  selector: 'simple-ngrx',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ CounterActions, CurseActions, CuboActions ],    
  templateUrl: './chart.container.html'
})
export class SimpleNgrx {
  showSidenav$: Observable<boolean>;
  items$: Observable<Array<cuboState>>;

  columnsGroup: Array<IColumns>;
  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;

  @ViewChildren(ChartComponent) charts : QueryList<ChartComponent>;

  constructor(
    private counterActions: CounterActions,
    private curseActions: CurseActions,
    private cuboActions: CuboActions,
    private _cuboCuotaService: CuboCuotaService,
    private store: Store<any>) {
      this.showSidenav$ = this.store.select(fromRoot.getShowSidenav);
      this.items$ = this.store.select('CollectionItems')
  }

  closeSidenav() {
    /**
     * All state updates are handled through dispatched actions in 'container'
     * components. This provides a clear, reproducible history of state
     * updates and user interaction through the life of our
     * application.
     */
    this.store.dispatch(new Sidenav.CloseSidenavAction());
  }

  openSidenav() {
    //debugger;
    this.openNav();

    this.store.dispatch(new Sidenav.OpenSidenavAction());
    console.log(this.showSidenav$)
      
    console.log(this.items$);
  }

  loadCuboInicial(cuboMunicipio, nivelesMunicipio): void{
    
    this.columnsGroup = nivelesMunicipio;
    
    //Refresh all Chart
    this.charts.forEach((charting) => {
      let nivelesChart = charting.levels;
      let seriesChart = charting.displaySeries;

      let chartDataset = this._cuboCuotaService.getCuboFiltrado(
        cuboMunicipio,
        nivelesMunicipio,
        nivelesChart
      );
      
      let newContainer = this.getChartContainer(chartDataset, nivelesChart[0]);
      this.cuboActions.loadCubo(charting.id, chartDataset, nivelesChart, seriesChart, newContainer.resumen);

      charting.dataset = newContainer.data.series;
      charting.dataLabels = newContainer.data.names; 
      charting.refresh();
    });

    //this.openNav();
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
  }

  refreshChartContainer(charId: string) {

  }

  private getChartContainer(cuboFiltrado, labelColumn: string) {
        
    let series: any[] = [];
    let resumenFiltrado = this._cuboCuotaService.getDefaultResumen();
    let indexGroup : number = this.columnsGroup.findIndex((idx) => { return idx.id === labelColumn })
    let keysColumns = this.keys(this.columnsGroup[indexGroup].values); //Sample: CON, FCS, FRR, etc...

    //if (indexGroup !== -1) {
      
      //Adding Series
      let currentLabel = this.columnsGroup[indexGroup].name;

      this.columnsQuantity.forEach((serie) => {
        series.push({data: Array.from({length: keysColumns.length}, () => 0), 
                     label: currentLabel + " - " + serie.id, column: serie.id }); //Sum_Cuota, etc...
      });

      for (var rowCol = 0, j = keysColumns.length; rowCol !== j; rowCol++) {
        for (var x = 0, y = cuboFiltrado.length; x != y; x++){          
          if(keysColumns[rowCol] == cuboFiltrado[x][this.columnsGroup[indexGroup].id]) {

            //Update "Quantity Value"
            series.forEach((serie) => {
                //Validar si la columna es "SUM_CUOTA" para aplicar el gravamen
                let datoColumn = cuboFiltrado[x][serie.column];
                /*if(serie.column === "SUM_CUOTA")
                {
                  datoColumn = (this.tipoGravamen / 100) * cuboFiltrado[x]['SUM_V_CATASTR'];
                  //this.resumenFiltrado.SUM_CUOTA += datoColumn;
                }*/
                serie.data[rowCol] = datoColumn;
                resumenFiltrado[serie.column] += datoColumn; 
            });
            break;
          }
        }
      }

      //Adding to container
      let containerChart = { 
            names : keysColumns.map((el) => { return el.substring(0, 40) }), 
            series:  series
          }
      
      return { data: containerChart, resumen: resumenFiltrado };      
    //}
  }

  keys(currentDict: any) : Array<string> {
    return Object.keys(currentDict);
  }

}
