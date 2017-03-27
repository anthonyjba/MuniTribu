import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.css']
})
export class ChartBarComponent implements OnInit {
  private _ds: any[] = [{data: [], label: 'Series A'}];
  private _names: any[] = [];

  constructor() { }

  ngOnInit(){
    //this.barChartData = this._ds;
    //console.log(this.barChartData);
  }

  @Input()
  set dataset(data: any[]) {
    this._ds = data;
  }
  get dataset(): any[] { return this._ds; }

  @Input()
  set dataLabels(names: any []) {
    this._names = names;
  }
  get dataLabels(): any[] { return this._names; }

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  
  public barChartLabels:string[] = []; //['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = true;
 
 public barChartData: any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
    //,{data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  //public barChartData: any[]= [];
 
  // events
  public chartReload(container) {
    console.log("Reload");
    console.log(container.names);
    //console.log(this.barChartData);
    
    this.barChartData = container.series;
    this.barChartLabels = container.names;
  }

  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
 
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

}
