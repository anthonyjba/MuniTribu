import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'cat-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent {
  @ViewChild( BaseChartDirective ) chart : BaseChartDirective;

  SERIE_DEFAULT = [{data: [], label: 'Sin Series'}];

  constructor() {
    this._ds =  this.SERIE_DEFAULT;
   }

  /* Default Values */
  private _ds: any[] = this.SERIE_DEFAULT;
  private _names: string[] = [];
  private _chartType: string = 'bar';
  private _legend: boolean = true;
  private _id: string = '';

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
  id: string = this._id;

  @Input()
  charType: string = this._chartType;
  
  @Input()
  legend: boolean = this._legend;

  @Input()
  series: any[];

  public options:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  refresh(container) {
        if (this.chart) {

          //Valida las series de cada componente chart
          this.dataset = !this.series ? container.series : 
                                this.series.length > 0 ? 
                                container.series.filter((c) => { return this.series.join(',').indexOf(c.column) > -1 }) :
                                this.SERIE_DEFAULT;
          this.chart.datasets = this.dataset;
          
          //this.chart.labels
          this.dataLabels = container.names;
          this.chart.labels =this.dataLabels; 
          
          this.chart.ngOnChanges( {} );
        }
  }

}
