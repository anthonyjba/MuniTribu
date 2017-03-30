import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent {
  @ViewChild( BaseChartDirective ) chart : BaseChartDirective;

  constructor() {
   }

  /* Default Values */
  private _ds: any[] = [{data: [], label: 'Series A'}];
  private _names: string[] = [];
  private _chartType: string = 'bar';
  private _legend: boolean = true;

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
  Id: string;

  @Input()
  charType: string = this._chartType;
  
  @Input()
  legend: boolean = this._legend;

  @Input()
  series: string[];

  public options:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  refresh() {
        if (this.chart) {
          //console.log(this.charType);
          //Validar series para cada componente chart
          this.chart.datasets = this.dataset;
          this.chart.labels = this.dataLabels;
          this.chart.ngOnChanges({});
        }
  }

}
