import { Component, ViewChildren, ViewChild, ChangeDetectorRef, QueryList } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import "rxjs/add/operator/take";

//app components
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ChartComponent } from '../components/chart/chart.component';
import { CounterComponent } from '../components/counter/counter.component';



import * as Cubo from '../actions/cubo-actions'
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
  providers: [ Cubo.CuboActions ],    
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
    private cuboActions: Cubo.CuboActions,
    private _cuboCuotaService: CuboCuotaService,
    private cdRef:ChangeDetectorRef,
    private store: Store<any>) {
      this.showSidenav$ = this.store.select(fromRoot.getSidenavState) 
      this.showSidenav$.subscribe(data => this.openNav(data));
      this.currentItem$ = this.store.select(fromRoot.getSelected);
  }


  closeSidenav(id) {
    this.store.dispatch(new Sidenav.CloseSidenavAction(id));
  }

  openSidenav(id) {
    this.store.dispatch(new Sidenav.OpenSidenavAction(id));    
  }

  loadCuboInicial(cuboMunicipio: Array<ICubo_Couta>, 
                  gravamenMunicipio: number, 
                  nivelesMunicipio: Array<IColumns>
                 ): void {
    /**
     * Load and Initialize All chart components. 
     * Update the global State 
     * draw each chart component
     * update Counter component
     */
    this.cuboMunicipioInicial = cuboMunicipio;
    this.currentGravamen = gravamenMunicipio;
    this.columnsGroup = nivelesMunicipio;
    
    this.charts.forEach(charting => {
      let nivelesChart = charting.levels;
      let seriesChart = charting.displaySeries;

      let chartDataset = this._cuboCuotaService.getCuboFiltrado(
        this.cuboMunicipioInicial,
        this.columnsGroup,
        nivelesChart
      );

      let filtroSecundario = this.__getValueSecondLevel(nivelesChart)

      charting.title = "Gráfico de " + nivelesChart[0];

      if(filtroSecundario) {
        charting.title += " - " + filtroSecundario
        chartDataset = chartDataset.filter(data => data[nivelesChart[1]] === filtroSecundario);
      }
      
      let newContainer = this.getChartContainer(chartDataset, gravamenMunicipio, nivelesChart[0]);
      //store      
      this.cuboActions.loadCubo(charting.id, chartDataset, nivelesChart, 
                                gravamenMunicipio, filtroSecundario, newContainer.resumen);
      this.updateChartComponent(charting, newContainer.data.series, newContainer.data.names);
      this.updateCountersComponent(charting.id, newContainer.resumen);
    });

  }

  private __getValueSecondLevel(niveles) {
    /**
     * Devolver solo un tipo para el 2 nivel
     */
    let result = "";
    
    if( niveles.length === 2 ) {      
      let indice = this.columnsGroup.findIndex((item) => item.id === niveles[1]);
      result = keys(this.columnsGroup[indice].values)[0];
    }
    return result
  }

  private __refreshAll(action) {

    let chartDataset = this._cuboCuotaService.getCuboFiltrado(
        this.cuboMunicipioInicial,
        this.columnsGroup,
        this.currentNivel$
      );

    if( this.currentNivel$.length === 2 ) {
      //Filtrar solo un tipo del 2 nivel
      
    }

    let newContainer = this.getChartContainer(chartDataset, this.currentGravamen, this.currentNivel$[0]);

    

    switch(action){
        case Cubo.ActionTypes.FILTER_CUBO : {
          this.cuboActions.filterCubo(this.currentChartId, this.currentFiltros$, newContainer.resumen);
          break;
        }
        case Cubo.ActionTypes.GRAVAMEN_CUBO : {
          this.cuboActions.gravamenCubo(this.currentChartId, this.currentGravamen, newContainer.resumen);
          break;
        }
     }

    let currentChart = this.charts.find(cchart => { return cchart.id === this.currentChartId});
    this.updateChartComponent(currentChart, newContainer.data.series, newContainer.data.names);
    this.updateCountersComponent(this.currentChartId, newContainer.resumen);
  }

  onChangeTipoGrav() {
    this.__refreshAll(Cubo.ActionTypes.GRAVAMEN_CUBO);    
  }

  onCurrentState(data){
    this.currentChartId = data.state.id;
    this.currentNivel$ = data.state.niveles;
    this.currentFiltros$ = data.state.filtros;
    this.currentGravamen = data.state.gravamen;

    if(data.action !== Sidenav.ActionTypes.OPEN_SIDENAV)
      this.__refreshAll(data.action);
  }

  private openNav(content) {

    if(content['showSidenav']){
      document.getElementById("mySidenav").style.width = "250px"
      document.getElementById("main").style.marginLeft = "250px";

      this.currentItem$.take(1).subscribe(item => this.sidenav.activate(item, this.columnsGroup));
      
    }
  }

  private closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
    this.closeSidenav(this.currentChartId);
  }

  private updateChartComponent(chart, series, labels) {
    chart.dataset = series;
    chart.dataLabels = labels; 
    chart.refresh();
  }

  private updateCountersComponent(chartId: string, resumen: any) {
      this.counters.forEach(counting => {
        if(counting.id.substr(0, chartId.length) === chartId) {                    
          counting.value = resumen[counting.field];
        }
      })
  }

  private getChartContainer(cuboFiltrado: any[], tipoGravamen: number, labelColumn: string) {
        
    let series: any[] = [];
    let resumenFiltrado = this._cuboCuotaService.getDefaultResumen();
    let indexGroup : number = this.columnsGroup.findIndex((idx) => { return idx.id === labelColumn })
    let keysColumns = keys(this.columnsGroup[indexGroup].values); //Sample: CON, FCS, FRR, etc...

    //if (indexGroup !== -1) {
      
      //Adding Series
      let currentLabel = this.columnsGroup[indexGroup].name;

      this.columnsQuantity.forEach((serie, indice) => {
        series.push({data: Array.from({length: keysColumns.length}, () => 0),
                     backgroundColor: serie.color,
                     label: currentLabel + " - " + serie.id, 
                     column: serie.id }); //Sum_Cuota, etc...
      });

      resumenFiltrado.TIPO_GRAVAMEN = tipoGravamen;

      //Loop all items
      for (var rowCol = 0, j = keysColumns.length; rowCol !== j; rowCol++) {
        for (var x = 0, y = cuboFiltrado.length; x != y; x++){          
          if(keysColumns[rowCol] == cuboFiltrado[x][this.columnsGroup[indexGroup].id]) {

            //Update Series
            series.forEach((serie) => {
                //Valida si la columna es "SUM_CUOTA" para aplicar el gravamen
                let datoColumn = cuboFiltrado[x][serie.column];
                if(serie.column === "SUM_CUOTA")
                {
                  datoColumn = (tipoGravamen / 100) * cuboFiltrado[x]['SUM_V_CATASTR'];
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
