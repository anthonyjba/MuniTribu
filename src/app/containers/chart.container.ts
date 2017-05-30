import { Component, ViewChildren, ViewChild, ChangeDetectorRef, QueryList } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import "rxjs/add/operator/take";

//app components
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ChartComponent } from '../components/chart/chart.component';
//import { CounterComponent } from '../components/counter/counter.component';



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
  currentfiltroNivel2$: any = {};
  columnsGroup: Array<IColumns>;
  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;
  cuboMunicipioInicial: Array<ICubo_Couta>;

  @ViewChild(SidenavComponent) sidenav : SidenavComponent;
  @ViewChildren(ChartComponent) charts : QueryList<ChartComponent>;
  //@ViewChildren(CounterComponent) counters : QueryList<CounterComponent>;

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
     */
    this.cuboMunicipioInicial = cuboMunicipio;
    this.currentGravamen = gravamenMunicipio;
    this.columnsGroup = nivelesMunicipio;
    
    this.charts.forEach(charting => {
      this.currentChartId = charting.id;
      this.currentNivel$ = charting.levels;
      //this.currentfiltroNivel2$ = Object.assign({}, this.__getValueSecondLevel(this.currentNivel$));  //this.__getValueSecondLevel(this.currentNivel$);

      this.__refreshAll(Cubo.ActionTypes.LOAD_CUBO);
      
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
    /**
     * Get Dataset from cuboCuotaService 
     * Verify the title with the current state 
     * Valid and filter the Dataset for Level 2
     * Update the new state reducer
     * Draw each chart component
     * Update Counter component
     */
    
    let chartDataset = this._cuboCuotaService.getCuboFiltrado(
        this.cuboMunicipioInicial,
        this.columnsGroup,
        this.currentNivel$
      );

    let currentChart = this.charts.find(cchart => { return cchart.id === this.currentChartId});
    currentChart.title = `Gráfico de ${this.currentNivel$[0]}`;

    let keysLevel2 : any = {};
    if( this.currentNivel$[1] ) {
      
      currentChart.title += (keys(this.currentfiltroNivel2$).length > 0) ? 
                              ` - ${this.currentNivel$[1]} (Con ciertos valores)` :
                              ` - ${this.currentNivel$[1]} (Con todos los valores)`
      
      

      let newDataset: Array<ICubo_Couta> = [];
      let tempLevel1: string = "";
      let index: number = -1;

      for(let i=0, l = chartDataset.length; i < l; i++) {
        if (tempLevel1 != chartDataset[i][this.currentNivel$[0]]) {           
          tempLevel1 = chartDataset[i][this.currentNivel$[0]];          
          newDataset.push(chartDataset[i]);
          index++;
        }
        else {
          this.columnsQuantity.forEach(c => {
            newDataset[index][c.id] += chartDataset[i][c.id] 
          })
        }        
      }

      chartDataset = newDataset;      
      
      let indice = this.columnsGroup.findIndex((item) => item.id === this.currentNivel$[1]);
      keysLevel2 = keys(this.columnsGroup[indice].values);

      //chartDataset = chartDataset.filter(data => data[this.currentNivel$[1]] === this.currentfiltroNivel2$);
    }

    let newContainer = this.getChartContainer(chartDataset, this.currentGravamen, this.currentNivel$[0]);
    
    switch(action){
        case Cubo.ActionTypes.LOAD_CUBO: {
          this.cuboActions.loadCubo(this.currentChartId, chartDataset, this.currentNivel$, 
                                this.currentGravamen, this.currentfiltroNivel2$, newContainer.resumen);
          break;
        }
        case Cubo.ActionTypes.FILTER_CUBO: {
          this.cuboActions.filterCubo(this.currentChartId, this.currentFiltros$, 
                                this.currentfiltroNivel2$, newContainer.resumen);
          break;
        }
        case Cubo.ActionTypes.GRAVAMEN_CUBO: {
          this.cuboActions.gravamenCubo(this.currentChartId, this.currentGravamen, newContainer.resumen);
          break;
        }
        case Cubo.ActionTypes.SWITCH_LEVEL_CUBO: {
          this.cuboActions.switchLevelCubo(this.currentChartId, this.currentNivel$, 
                                this.currentfiltroNivel2$, newContainer.resumen)
          break;
        }
     }

    
    this.updateChartComponent(currentChart, newContainer, keysLevel2);
    //this.updateCountersComponent(this.currentChartId, newContainer.resumen);
  }

  onChangeTipoGrav() {
    this.__refreshAll(Cubo.ActionTypes.GRAVAMEN_CUBO);    
  }

  onCurrentState(data){
    this.currentChartId = data.state.id;
    this.currentNivel$ = data.state.niveles;
    this.currentFiltros$ = data.state.filtros;
    this.currentGravamen = data.state.gravamen;
    this.currentfiltroNivel2$ = data.state.filtroNivel2;

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

  private updateChartComponent(chart: ChartComponent, 
                              container: any, 
                              columns: any) {
    chart.dataset = container.data.series;
    chart.dataLabels = container.data.names;
    chart.dataResumen = container.resumen;
    chart.dataColumns = columns;
    chart.refresh();
  }

  /*private updateCountersComponent(chartId: string, resumen: any) {
      this.counters.forEach(counting => {
        if(counting.id.substr(0, chartId.length) === chartId) {                    
          counting.value = resumen[counting.field];
        }
      })
  }*/

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
