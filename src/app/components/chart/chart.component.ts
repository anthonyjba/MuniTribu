import { Component, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { COLUMNS_QUANTITY, COLUMNS_GROUP } from '../../shared/config';
import { IDefault, ICubo_Couta } from '../../shared/interfaces';
import { Color} from 'ng2-charts';

@Component({
  selector: 'cat-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  @ViewChild( BaseChartDirective ) chart : BaseChartDirective;
  @ViewChildren( 'optsSerie' ) optionsSeries : QueryList<Element>; 


  //DEFAULT_SERIE = [{data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //  {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}];
  //  ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];

  /* Default Values */
  DEFAULT_SERIE = [{data: [], label: 'Sin Series'}];
  DEFAULT_RESUMEN: ICubo_Couta = { N_SUBPARC:0, N_PROPIETARIOS:0, SUM_HECT:0, SUM_V_CATASTR:0, SUM_CUOTA:0, TIPO_GRAVAMEN:0 }
  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;
  colorsEmptyObject: Array<Color> = [{}];

  private _ds: any[] = this.DEFAULT_SERIE;
  private _names: string[] = [];
  private _resumen: ICubo_Couta = this.DEFAULT_RESUMEN;
  private _fontSize: number = 10;  

  constructor() {
    this._ds =  this.DEFAULT_SERIE;
   }

  ngAfterViewInit() {
    if(this.activateControls) {
      this.optionsSelected(this.optionsSeries, this.displaySeries[0]);

      if( this.levels.length === 2 ) {      
        //let indice = this.columnsGroup.findIndex((item) => item.id === this.levels[1]);
        //keys(this.columnsGroup[indice].values)[0];
      }
      
      }
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
  set dataResumen(data: ICubo_Couta){
    this._resumen = data;
  }
  get dataResumen(): ICubo_Couta { return this._resumen; }
  
  @Input()
  id: string;

  @Input()
  title: string;

  @Input()
  charType: string;
  
  @Input()
  legend: boolean = false;

  @Input()
  activateControls: boolean = false;

  @Input()
  levels: string[];

  @Input()
  displaySeries: string[];

 @Output() activate = new EventEmitter();

  public options:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
        xAxes: [{
            ticks: {
                fontSize: this._fontSize
            }
        }],
        yAxes: [{
            ticks: {
                fontSize: this._fontSize
            }
        }]
    }
  };

  private optionsSelected(series, element: string) {

    series.forEach(s => {
      s.nativeElement.classList.remove("btn-serie-sel");
    });
    
    let current = series.find(s => s.nativeElement.id === element);
    current.nativeElement.classList.add("btn-serie-sel");
  }

  /*private optionsSelectedOld(input, values) {
      let options = input.nativeElement.options;
      for(let i=0; i < options.length; i++) {
          options[i].selected = values.join(',').indexOf(options[i].value) > -1;
      }
  }*/

  private onSerieSelected(currentSerie) {
    this.displaySeries[0] = currentSerie;
    this.optionsSelected(this.optionsSeries, currentSerie);
    this.refresh();
  }

  /*onChangeSeries(el) {
    this.displaySeries = Array.apply(null, el.options)
      .filter(option => option.selected)
      .map(option => option.value)
    
    this.refresh();
  }*/

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

          //console.log(this.dataResumen.TIPO_GRAVAMEN);
        }
  }

}
