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

  refresh() {
        if (this.chart) {
          //console.log(this.charType + " - " + this.series);
          /*if(this.series){
            var list = this.dataset.filter((c) => { return this.series.indexOf(c.column) > -1 });
            console.log(list);
          }*/
          //Validar series para cada componente chart
          this.chart.datasets = !this.series ?  this.dataset : 
                                this.dataset.filter((c) => { return this.series.indexOf(c.column) > -1 });
          this.chart.labels = this.dataLabels;
          this.chart.ngOnChanges({});
        }
  }

}
