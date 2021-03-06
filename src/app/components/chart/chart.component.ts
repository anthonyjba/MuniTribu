import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
 

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { COLUMNS_QUANTITY, COLORS_CHART } from '../../shared/config';
import { IDefault, ICubo_Couta, IColumns } from '../../shared/interfaces';
import { Color} from 'ng2-charts';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import "rxjs/add/operator/take";

import { cuboState } from '../../models/cubo-state.model'
import * as Sidenav from '../../actions/sidenav-actions';
import * as Cubo from '../../actions/cubo-actions'
import * as fromRoot from '../../reducers';

require('chart.js');
declare var Chart: any;
declare var jQuery: any;

@Component({
  selector: 'cat-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @ViewChild( BaseChartDirective ) chart : BaseChartDirective;
  @ViewChild('mylegend') mylegend : any;
  @ViewChildren('optsSerie') optionsSeries : QueryList<Element>; 

  currentItem$: Observable<cuboState>;
  storeChartId: string = "";

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
  private _columns: Array<any> = [];
  private _fontSize: number = 10;  

  constructor(
    private store: Store<any>,
    private sanitizer: DomSanitizer
  ) {
    this._ds =  this.DEFAULT_SERIE;
    this.currentItem$ = this.store.select(fromRoot.getSelected);
   }

  ngOnInit() {
    // SelectPicker component
    if(this.activateControls){
      
      
    }

    // Chart component
    Chart.defaults.global.defaultFontColor = "#999";
    Chart.pluginService.register({

      afterDatasetsDraw: function(chartInstance, easing) {

        if (chartInstance.config.type === "pie") {
          // To only draw at the end of animation, check for easing === 1
          var ctx = chartInstance.chart.ctx;
          chartInstance.data.datasets.forEach(function(dataset, i) {
            var meta = chartInstance.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function(element, index) {
                // Draw the text in black, with the specified font
                ctx.fillStyle = '#333';
                var fontSize = 10;
                var fontStyle = 'normal';
                var fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';
                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                // Just naively convert to string for now
                var dataString = dataset.data[index].toString();
                // Make sure alignment settings are correct
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var padding = 0;
                var position = element.tooltipPosition();
                ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
              });
            }
          });
        }
      }

    });
  } 

  ngAfterViewInit() {
    if(this.activateControls) {
      this.optionsSelected(this.optionsSeries, this.displaySeries[0]);
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
  set dataColumns(columns: string[]){
    this._columns = columns;
  }
  get dataColumns(): string[] { return this._columns; }
  
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

  currentGravamen: number = 0;
  protected legendKeys = [];
  protected colors = COLORS_CHART;
  protected innerLegend: SafeHtml;

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

  private onSerieSelected(currentSerie) {
    this.displaySeries[0] = currentSerie;
    this.optionsSelected(this.optionsSeries, currentSerie);
    this.refresh();
  }

  onChangeTipoGrav() {
    let currentState : cuboState;

    this.store.dispatch(new Sidenav.OpenSidenavAction(this.id));
    this.currentItem$.take(1).subscribe(item => currentState = item);
    
    currentState.gravamen = this.currentGravamen;

    this.activate.emit({ state: currentState, action: Cubo.ActionTypes.GRAVAMEN_CUBO });
  }


  onChangeLevel2(el) {
    let currentState : cuboState;
    
    this.store.dispatch(new Sidenav.OpenSidenavAction(this.id));
    this.currentItem$.take(1).subscribe(item => currentState = item);

    currentState.filtroNivel2 = {}; 
    let keyLevel2 = Array.apply(null, el.options)
      .filter(option => option.selected)
      .map(option => currentState.filtroNivel2[option.value] = 1 )

    this.activate.emit({ state: currentState, action: Cubo.ActionTypes.SWITCH_LEVEL_CUBO });
  }

  private legendDrawing(chart) {
    this.legendKeys =  chart.labels;
    
    var text = [];
    text.push('<ul>');
    
    for (var i = 0; i < this.legendKeys.length; i++) {
      text.push(`<li><span style="background-color:${chart.datasets[0].backgroundColor[i]}" >`);
      if (chart.labels[i]) {
        text.push(chart.labels[i]);
      }
      text.push('</span></li>');
    }
    text.push('</ul>');

    this.innerLegend = this.sanitizer.bypassSecurityTrustHtml(text.join("")); 
    
    return true;
  }

  populateSelect(listSelect) {
    if(this.activateControls) {
      let combo = jQuery('#q_'+this.id)
      combo.children('option').remove();
      listSelect.forEach(item => {
        combo.append(`<option value='${item}'>${ item }</option>`);        
      });
      combo.selectpicker();
      combo.selectpicker('refresh');
    }
  }

  refresh() {
        if( this.chart ) {

          //Valida las series a mostrar de cada componente chart
          this.chart.datasets = !this.displaySeries ? this.dataset : 
                                this.displaySeries.length > 0 ? 
                                this.dataset.filter((c) => { return this.displaySeries.join(',').indexOf(c.column) > -1 }) :
                                this.DEFAULT_SERIE;
          
          //añadir la propiedad orden y lanzar por un evento para ordenar por una serie elegida
          this.chart.labels =this.dataLabels;

          if(this.chart.chartType === "pie"){            
            delete this.chart.options.scales;                        
            let num = this.chart.datasets[0].data.length;

            this.chart.datasets[0].backgroundColor = COLORS_CHART.slice(0,num);
            this.chart.datasets[0].borderColor = Array(num).fill('gray');
            this.chart.datasets[0].borderWidth = Array(num).fill(1);
            this.chart.options.legend= {
                boxWidth: '15px',
                display: true,
                legendCallback: this.legendDrawing(this.chart)
            }            
            
          }
           
          this.chart.ngOnChanges( {} );

          this.currentGravamen = this.dataResumen.TIPO_GRAVAMEN; 

        }
  }

}
