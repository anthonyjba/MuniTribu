import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { COLUMNS_LEVEL, COLUMNS_QUANTITY  } from '../../shared/config';
import { IDefault  } from '../../shared/interfaces';

@Component({
  selector: 'cat-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent {
  @ViewChild( BaseChartDirective ) chart : BaseChartDirective;

  DEFAULT_SERIE = [{data: [], label: 'Sin Series'}];

  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;
  columnsLevel: Array<IDefault> = COLUMNS_LEVEL;

  //DEFAULT_SERIE = [{data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //  {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}];

  constructor() {
    this._ds =  this.DEFAULT_SERIE;
   }

  /* Default Values */
  private _ds: any[] = this.DEFAULT_SERIE;
  private _names: string[] = []; //['2006', '2007', '2008', '2009', '2010', '2011', '2012'];

  @Input()
  set dataset(data: any[]) {
    this._ds = data;
  }
  get dataset(): any[] { return this._ds; }

  @Input()
  set dataLabels(names: string[]) {
    this._names = names;
  }
  get dataLabels(): string[] { return this._names; }
  
  @Input()
  id: string;

  @Input()
  charType: string;
  
  @Input()
  legend: boolean = true;

  @Input()
  displaySeries: any[];

  public options:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  refresh(container) {
        if (this.chart) {

          //Valida las series a mostrar de cada componente chart
          this.dataset = !this.displaySeries ? container.series : 
                                this.displaySeries.length > 0 ? 
                                container.series.filter((c) => { return this.displaySeries.join(',').indexOf(c.column) > -1 }) :
                                this.DEFAULT_SERIE;
          this.chart.datasets = this.dataset;

          //añadir la propeiedad orden y lanzar por un evento para ordenar por una serie elegida
          
          //this.chart.labels
          this.dataLabels = container.names;
          this.chart.labels =this.dataLabels; 
          this.chart.ngOnChanges( {} );
        }
  }

}
