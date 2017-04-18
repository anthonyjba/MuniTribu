import { Component, ViewChildren, QueryList } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Counter } from '../components/counter-component';
//import { ChartListComponent } from '../components/chart/chart-list';
import { ChartComponent } from '../components/chart/chart.component';
import { CounterActions } from '../actions/counter-actions';
import { CurseActions } from '../actions/curse-actions';
import { Chart1Actions } from '../actions/chart1-actions'
import reducer from '../reducers/index';
import { cuboState } from '../models/cubo-state'

import { CuboCuotaService } from '../services/cubo-cuota.service';
import { COLUMNS_GROUP, COLUMNS_QUANTITY  } from '../shared/config';
import { IDefault } from '../shared/interfaces';

@Component({
  selector: 'simple-ngrx',
  providers: [ CounterActions, CurseActions, Chart1Actions ],    
  templateUrl: './chart.container.html'
})
export class SimpleNgrx {
  counter$: Observable<number>;
  curse$: Observable<number>;
  chart1$: Observable<cuboState>
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
      this.chart1$ = store.select('cubo')
      
    }

  loadCuboInicial(cubo, columns): void{
    
    let chart1Dataset = this._cuboCuotaService.getCuboFiltrado(
       cubo,
       columns
     );

    this.chartActions.loadCubo(chart1Dataset, columns);

    this.parseChart(cubo, columns)
    //[dataset]="chart1$"
  }

  private parseChart(cuboFiltrado, columnsGroup) {
    let indexGroup : number = columnsGroup.findIndex((idx) => { return idx.display === true })
    let series: any[] = [];

    if (indexGroup !== -1) {
      let keysColumns = this.keys(columnsGroup[indexGroup].values); //Sample: CON, FCS, FRR, etc...
      
      //Adding a Serie
      let currentLabel = columnsGroup[indexGroup].name;

      this.columnsQuantity.forEach((serie) => {
        series.push({data: Array.from({length: keysColumns.length}, () => 0), 
                     label: currentLabel + " - " + serie.id, column: serie.id }); //Sum_Cuota, etc...
      });

      for (var rowCol = 0, j = keysColumns.length; rowCol !== j; rowCol++) {
        for (var x = 0, y = cuboFiltrado.length; x != y; x++){          
          if(keysColumns[rowCol] == cuboFiltrado[x][columnsGroup[indexGroup].id]) {

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
                //this.resumenFiltrado[serie.column] += datoColumn; 
            });
            break;
          }
        }
      }

      //Adding to container
      let containerChart = { 
            names : this.keys(columnsGroup[indexGroup].values).map((el) => { return el.substring(0, 40) }), 
            series:  series
          }
      
      //Refresh all Chart
      this.charts.forEach((charting) => {
        charting.refresh(containerChart);
      });
      
    }
  }

  keys(currentDict: any) : Array<string> {
    return Object.keys(currentDict);
  }

}
