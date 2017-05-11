import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { COLUMNS_LEVEL, COLUMNS_QUANTITY  } from '../../shared/config';
import { IDefault  } from '../../shared/interfaces';
import { Color} from 'ng2-charts';

@Component({
  selector: 'cat-chart',
  templateUrl: './chart.component.html',
  styles: [`
    .panel-container-chart {
      padding: 0px;
      height: 16px !important;
    }    
  `]
})
export class ChartComponent {
  @ViewChild( BaseChartDirective ) chart : BaseChartDirective;
  @ViewChild( 'optsLevel' ) optionsLevel;
  @ViewChild( 'optsSerie' ) optionsSerie; 

  DEFAULT_SERIE = [{data: [], label: 'Sin Series'}];

  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;

  //DEFAULT_SERIE = [{data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //  {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}];

  /* Default Values */
  private _ds: any[] = this.DEFAULT_SERIE;
  private _names: string[] = []; //['2006', '2007', '2008', '2009', '2010', '2011', '2012'];

  constructor() {
    this._ds =  this.DEFAULT_SERIE;
   }

  ngAfterViewInit() { 
    this.optionsSelected(this.optionsSerie, this.displaySeries);
   }

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
  title: string;

  @Input()
  charType: string;
  
  @Input()
  legend: boolean = false;

  @Input()
  levels: string[];

  @Input()
  displaySeries: string[];

  colorsEmptyObject: Array<Color> = [{}];

  @Output() activate = new EventEmitter();

  public options:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  private optionsSelected(input, values) {
      let options = input.nativeElement.options;
      for(let i=0; i < options.length; i++) {
          options[i].selected = values.join(',').indexOf(options[i].value) > -1;
      }
  }

  onChangeSeries(el) {
    this.displaySeries = Array.apply(null, el.options)
      .filter(option => option.selected)
      .map(option => option.value)
    
    this.refresh();
  }

  onSettings() {
    this.activate.emit(this.id);
  }

  refresh() {
        if (this.chart) {

          //Valida las series a mostrar de cada componente chart
          this.chart.datasets = !this.displaySeries ? this.dataset : 
                                this.displaySeries.length > 0 ? 
                                this.dataset.filter((c) => { return this.displaySeries.join(',').indexOf(c.column) > -1 }) :
                                this.DEFAULT_SERIE;

          //añadir la propeiedad orden y lanzar por un evento para ordenar por una serie elegida
          this.chart.labels =this.dataLabels; 
          this.chart.ngOnChanges( {} );
        }
  }

}
