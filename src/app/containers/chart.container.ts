import { Component, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Counter } from '../components/counter-component';
import { ChartComponent } from '../components/chart/chart.component';
import { CounterActions } from '../actions/counter-actions';
import { CurseActions } from '../actions/curse-actions';
import { Chart1Actions } from '../actions/chart1-actions'
//import reducer from '../reducers/index';
import { cuboState } from '../models/cubo-state'
//import { chart1 } from '../reducers/cubo-cuota';

import { CuboCuotaService } from '../services/cubo-cuota.service';
import { COLUMNS_QUANTITY  } from '../shared/config';
import { IColumns, IDefault } from '../shared/interfaces';

@Component({
  selector: 'simple-ngrx',
  providers: [ CounterActions, CurseActions, Chart1Actions ],    
  templateUrl: './chart.container.html'
})
export class SimpleNgrx {
  counter$: Observable<number>;
  curse$: Observable<number>;
  chart1$: Observable<cuboState>;
  chart2$: Observable<cuboState>;
  columnsGroup: Array<IColumns>;
  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;

  @ViewChildren(ChartComponent) charts : QueryList<ChartComponent>;

  constructor(
    private counterActions: CounterActions,
    private curseActions: CurseActions,
    private chartActions: Chart1Actions,
    private _cuboCuotaService: CuboCuotaService,
    store: Store<any>) {
      this.counter$ = store.select('counter');
      this.curse$ = store.select('curse');
      this.chart1$ = store.select('chart1')
      this.chart2$ = store.select('chart2')
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
      this.chartActions.loadCubo(chartDataset, nivelesChart, seriesChart, newContainer.resumen);

      charting.dataset = newContainer.data.series;
      charting.dataLabels = newContainer.data.names; 
      charting.refresh();
    });

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
