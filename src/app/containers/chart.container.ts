import { Component, ViewChildren, ChangeDetectorRef, QueryList } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import "rxjs/add/operator/take";

//app components
import { ChartComponent } from '../components/chart/chart.component';

import * as Cubo from '../actions/cubo-actions'
import { cuboState } from '../models/cubo-state.model'

import { CuboCuotaService } from '../services/cubo-cuota.service';
import { COLUMNS_QUANTITY  } from '../shared/config';
import { IColumns, IDefault, ICubo_Couta } from '../shared/interfaces';
import { keys, getUniqueValueById } from '../shared/util';


@Component({
  selector: 'simple-ngrx',
  providers: [ Cubo.CuboActions ],    
  templateUrl: './chart.container.html'
})
export class SimpleNgrx {
  currentGravamen: number;
  currentChartId: string;
  currentNivel$: string[];
  currentFiltros$: {};
  currentfiltroNivel2$: any = {};
  columnsGroup: Array<IColumns>;
  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;
  cuboMunicipioInicial: Array<ICubo_Couta>;

  @ViewChildren(ChartComponent) charts : QueryList<ChartComponent>;

  constructor(
    private cuboActions: Cubo.CuboActions,
    private _cuboCuotaService: CuboCuotaService,
    private cdRef:ChangeDetectorRef) {
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

  private __validCurrentState(chartId, niveles) {
    if(this.currentChartId !== chartId) {
      this.currentChartId = chartId;
      this.currentNivel$ = niveles;

      this.columnsGroup.forEach(c => { c.filters = {}; }); 
      this.currentfiltroNivel2$ = {}
    }
  }

  private __acumulateByLevel1(ds: any[]) {
    let newDataset: Array<ICubo_Couta>=[];
    let tempLevel1: string = "";
    let index: number = -1;
    let level1 = this.currentNivel$[0];

    ds.sort(function (a, b) {
      if (a[level1] > b[level1]) {
        return 1;
      }
      if (a[level1] < b[level1]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })

    ds.forEach((item) => {  
      if(item[level1] != tempLevel1) { 
        tempLevel1 = item[level1]; 
        index++;
        newDataset.push(Object.assign({},item)); } 
      else { 
        this.columnsQuantity.forEach(c => {
          newDataset[index][c.id] += item[c.id] 
        }) 
      }  
    });

    return newDataset;
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

    let niveles = []; 
    if(this.currentNivel$.some(n => { return n==="AC"})) {
      niveles = [...this.currentNivel$, "TIPO_EXPLOTACION"];
      //if(!this.currentNivel$.some(e=> { return e === "TIPO_EXPLOTACION"})) {
      //  this.currentNivel$.push("TIPO_EXPLOTACION");}
    }
    else{ niveles = [...this.currentNivel$] }
   
    let chartDataset = this._cuboCuotaService.getCuboFiltrado(
        this.cuboMunicipioInicial,
        this.columnsGroup,
        niveles
      )

    

    let currentChart = this.charts.find(cchart => { return cchart.id === this.currentChartId});
    currentChart.title = getUniqueValueById<string>(this.columnsGroup,this.currentNivel$[0],'name'); //`Gráfico de ${this.currentNivel$[0]}`;

    let keysLevel2 : any = {};
    if( this.currentNivel$[1] ) {
      let nameLevel2 = getUniqueValueById<string>(this.columnsGroup,this.currentNivel$[1],'name');
      
      currentChart.title += (keys(this.currentfiltroNivel2$).length > 0) ? 
                              ` - ${nameLevel2} (Con ciertos valores)` :
                              ` - ${nameLevel2} (Con todos los valores)`
      

      chartDataset = this.__acumulateByLevel1(chartDataset);

      //let indice = this.columnsGroup.findIndex((item) => item.id === this.currentNivel$[1]);
      keysLevel2 = keys(getUniqueValueById<any>(this.columnsGroup,this.currentNivel$[1],'values'));

      //chartDataset = chartDataset.filter(data => data[this.currentNivel$[1]] === this.currentfiltroNivel2$);
    }

    let newContainer = this.getChartContainer(chartDataset, this.currentGravamen, this.currentNivel$[0]);
    
    switch(action){
        case Cubo.ActionTypes.LOAD_CUBO: {
          this.cuboActions.loadCubo(this.currentChartId, this.currentNivel$, 
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
  }

  onCurrentState(data) {
    this.currentChartId = data.state.id;
    this.currentNivel$ =  data.state.niveles;

    this.columnsGroup.forEach(c => { c.filters = {}; });     
    this.currentGravamen = data.state.gravamen;
    this.currentfiltroNivel2$ = {}
    if( data.state.filtroNivel2 ) {
      this.currentfiltroNivel2$ = data.state.filtroNivel2;
      this.columnsGroup.find((col) => col.id === this.currentNivel$[1]).filters = data.state.filtroNivel2;
    }

    this.__refreshAll(data.action);

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

  private getChartContainer(cuboFiltrado: any[], tipoGravamen: number, labelColumn: string) {
        
    let series: any[] = [];
    let resumenFiltrado = this._cuboCuotaService.getDefaultResumen();
    let indexGroup : number = this.columnsGroup.findIndex((idx) => { return idx.id === labelColumn })
    let keysColumns = keys(this.columnsGroup[indexGroup].values); //Sample: CON, FCS, FRR, etc...

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
  }

}
