import { Component, ViewChildren, ViewChild, ChangeDetectorRef, QueryList } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import "rxjs/add/operator/take";

//app components
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ChartComponent } from '../components/chart/chart.component';
import { CounterComponent } from '../components/counter/counter.component';



import { CuboActions } from '../actions/cubo-actions'
import * as Sidenav from '../actions/sidenav-actions';
import * as fromRoot from '../reducers';

import { cuboState } from '../models/cubo-state.model'

import { CuboCuotaService } from '../services/cubo-cuota.service';
import { COLUMNS_QUANTITY  } from '../shared/config';
import { IColumns, IDefault, ICubo_Couta } from '../shared/interfaces';
import { keys } from '../shared/util';


@Component({
  selector: 'simple-ngrx',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ CuboActions ],    
  templateUrl: './chart.container.html'
})
export class SimpleNgrx {
  showSidenav$: Observable<any>;
  currentItem$: Observable<cuboState>;
  currentGravamen: number;
  currentChartId: string;
  currentNivel$: string[];
  currentFiltros$: {};
  columnsGroup: Array<IColumns>;
  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;
  cuboMunicipioInicial: Array<ICubo_Couta>;

  @ViewChild(SidenavComponent) sidenav : SidenavComponent;
  @ViewChildren(ChartComponent) charts : QueryList<ChartComponent>;
  @ViewChildren(CounterComponent) counters : QueryList<CounterComponent>;

  constructor(
    private cuboActions: CuboActions,
    private _cuboCuotaService: CuboCuotaService,
    private cdRef:ChangeDetectorRef,
    private store: Store<any>) {
      this.showSidenav$ = this.store.select(fromRoot.getSidenavState) 
      this.showSidenav$.subscribe(data => this.openNav(data));
      this.currentItem$ = this.store.select(fromRoot.getSelected);
  }


  //closeSidenav() {
    /**
     * All state updates are handled through dispatched actions in 'container'
     * components. This provides a clear, reproducible history of state
     * updates and user interaction through the life of our
     * application.
     */
    //this.store.dispatch(new Sidenav.CloseSidenavAction());
  //}

  openSidenav(id) {
    this.store.dispatch(new Sidenav.OpenSidenavAction(id));    
  }

  loadCuboInicial(cuboMunicipio, gravamenMunicipio, nivelesMunicipio): void{
    
    this.cuboMunicipioInicial = cuboMunicipio;
    this.currentGravamen = gravamenMunicipio;
    this.columnsGroup = nivelesMunicipio;
    
    //Refresh all Chart
    this.charts.forEach(charting => {
      let nivelesChart = charting.levels;
      let seriesChart = charting.displaySeries;

      let chartDataset = this._cuboCuotaService.getCuboFiltrado(
        this.cuboMunicipioInicial,
        this.columnsGroup,
        nivelesChart
      );
      
      let newContainer = this.getChartContainer(chartDataset, gravamenMunicipio, nivelesChart[0]);
      this.cuboActions.loadCubo(charting.id, chartDataset, nivelesChart, seriesChart, newContainer.resumen);

      //Update Chart component
      charting.dataset = newContainer.data.series;
      charting.dataLabels = newContainer.data.names; 
      charting.refresh();

      //Update counters component
      this.updateCounters(charting.id, newContainer.resumen);
    });

  }

  onChangeTipoGrav() {

    let chartDataset = this._cuboCuotaService.getCuboFiltrado(
        this.cuboMunicipioInicial,
        this.columnsGroup,
        this.currentNivel$
      );

    let newContainer = this.getChartContainer(chartDataset, this.currentGravamen, this.currentNivel$[0]);
    console.log(newContainer.resumen);

    //Update counters component
    this.updateCounters(this.currentChartId, newContainer.resumen);
  }

  onCurrentState(data){
    console.log(data);
    this.currentChartId = data.id;
    this.currentNivel$ = data.niveles;
    this.currentFiltros$ = data.filtros;
  }

  private openNav(content) {
    console.log(content);

    if(content['showSidenav']){
      document.getElementById("mySidenav").style.width = "250px"
      document.getElementById("main").style.marginLeft = "250px";

      this.currentItem$.take(1).subscribe(item => this.sidenav.activate(item, this.columnsGroup));
      
    }
  }

  private closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
  }

  private updateCounters(chartId: string, resumen: any) {
      this.counters.forEach(counting => {
        if(counting.id.substr(0, chartId.length) === chartId) {                    
          counting.value = resumen[counting.field];
          //this.cdRef.detectChanges();
        }
      })
  }

  private getChartContainer(cuboFiltrado, tipoGravamen, labelColumn: string) {
        
    let series: any[] = [];
    let resumenFiltrado = this._cuboCuotaService.getDefaultResumen();
    let indexGroup : number = this.columnsGroup.findIndex((idx) => { return idx.id === labelColumn })
    let keysColumns = keys(this.columnsGroup[indexGroup].values); //Sample: CON, FCS, FRR, etc...

    //if (indexGroup !== -1) {
      
      //Adding Series
      let currentLabel = this.columnsGroup[indexGroup].name;

      this.columnsQuantity.forEach((serie) => {
        series.push({data: Array.from({length: keysColumns.length}, () => 0), 
                     label: currentLabel + " - " + serie.id, column: serie.id }); //Sum_Cuota, etc...
      });

      resumenFiltrado.TIPO_GRAVAMEN = tipoGravamen;

      for (var rowCol = 0, j = keysColumns.length; rowCol !== j; rowCol++) {
        for (var x = 0, y = cuboFiltrado.length; x != y; x++){          
          if(keysColumns[rowCol] == cuboFiltrado[x][this.columnsGroup[indexGroup].id]) {

            //Update Series
            series.forEach((serie) => {
                //Validar si la columna es "SUM_CUOTA" para aplicar el gravamen
                let datoColumn = cuboFiltrado[x][serie.column];
                if(serie.column === "SUM_CUOTA")
                {
                  datoColumn = (tipoGravamen / 100) * cuboFiltrado[x]['SUM_V_CATASTR'];
                  //this.resumenFiltrado.SUM_CUOTA += datoColumn;
                }
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

  

}
