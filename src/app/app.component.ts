import { Component, OnInit, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

//app
import { COLUMNS_GROUP, COLUMNS_QUANTITY  } from './shared/config';
import { Dictionary } from './shared/enums';
import { IDefault, IColumns, ICubo_Couta } from './shared/interfaces';
import * as DictionaryModule from './services/dictionary.service';
import { CuboCuotaService } from './services/cubo-cuota.service';
import { ChartComponent } from './components/chart/chart.component';
import * as cubo from './actions/cuboCollection';
import { ChartListComponent } from './components/chart/chart-list'

import * as fromRoot from './reducers';
import { Observable } from 'rxjs/Observable';

//import { SimpleNgrx } from './containers/app-container';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { 
  errorMessage: string;
  title = 'Cuota del Valor Calculado!';

  //Declarations Properties
  municipios: Array<IDefault>
  cuboCuotaInicial: Array<ICubo_Couta>;
  cuboCuotaFiltrado: Array<ICubo_Couta>;
  resumenMunicipio: ICubo_Couta;
  resumenFiltrado: ICubo_Couta;
  columnsGroup: Array<IColumns> = COLUMNS_GROUP;
  columnsQuantity: Array<IDefault> = COLUMNS_QUANTITY;
  tipoGravamen: number = 0;
  containerChart = { names : [], series: [{data: [], label: 'Series A'}] };
  optsChart1: any[]= this.columnsQuantity.slice(0,2);
  optsChart2: any[]= this.columnsQuantity.slice(2);
  optsChart3: any[]= this.columnsQuantity.slice(0);

  @ViewChildren(ChartComponent) charts : QueryList<ChartComponent>;
  @ViewChildren('select') selectElRef;

  //Default Values
  selmuni: string = "45900";
  uniqueAccordion: boolean = true;

  cubo$: Observable<Array<ICubo_Couta>>;


  constructor(private _cubocuotaService: CuboCuotaService //private _store: Store<fromRoot.State>
              ) {
      this.resumenMunicipio = this.resumenFiltrado = _cubocuotaService.getDefaultResumen();


      //this._cubocuotaService.getCuboNgrx();
          

      
  }

  ngOnInit(){
    
    //this.municipios = DictionaryModule.getDictionary(Dictionary.Municipio);

    this._cubocuotaService.getCubo()
        .subscribe((data : Array<ICubo_Couta>) => this.cuboCuotaInicial = data,
                error => console.log(error),
                () => this.__extractDictionary());

    //this.cubo$ = this._store.select(fromRoot.getCuboEntities); 
    //this.cubo$.subscribe((data : Array<ICubo_Couta>) => 
    //            { this.__extractDictionary(data); });

    /*this._store.select(fromRoot.getCuboEntities)
    .subscribe((data : Array<ICubo_Couta>) => 
                { this.cuboCuotaInicial = data; });
    */

  }

  ngAfterContentInit() { console.log("ngAfterContentInit"); }

  ngAfterViewInit() { console.log("ngAfterViewInit"); 
    

    this.selectElRef.forEach((el) => {
      let options = el.nativeElement.options;
      if( el.nativeElement.id ){
        let currentChart = this.charts.find((c) => c.id === el.nativeElement.id.substr(2));
        for(let i=0; i < options.length; i++) {
          options[i].selected = currentChart.displaySeries.join(',').indexOf(options[i].value) > -1;
        }
      }
    });

    
     
}

  
  /** Eventos **/

  onUpdateColumns(result : Array<IColumns>){
    //Verificar porque repite esta funcion 2 veces
    if(result.length > 0) {
        this.columnsGroup = result;

        //refresh display filter
        this.__refreshAll();
    }    
  }

  onChangeSeries(el) {
    console.log("onChangeSeries");

    let currentChart = this.charts.find((c) => c.id === el.id.substr(2));

    currentChart.displaySeries = Array.apply(null, el.options)
      .filter(option => option.selected)
      .map(option => option.value)
    
    currentChart.refresh(this.containerChart);
  }

  onChangeTipoGrav(value: number) {
    this.parseChart();
  }

  onClick(event) {
    let dictCurrent = this.columnsGroup.find((col) => col.id === event.target.name).filters;

    if (dictCurrent.hasOwnProperty(event.target.id)){
      delete dictCurrent[event.target.id];
      event.currentTarget.classList.remove("active-widget");
      }
    else{
      dictCurrent[event.target.id] = 1;
      event.currentTarget.classList.add("active-widget");
    }

    //refresh display filter
    this.__refreshAll();
  }

  /** Private Methods ***/
  private __extractDictionary(){
    if(this.cuboCuotaInicial.length === 0) return;

    for (var i = 0, j = this.cuboCuotaInicial.length; i !== j; i++) {
      for (var x = 0, y = this.columnsGroup.length; x != y; x++){
        if(this.cuboCuotaInicial[i][this.columnsGroup[x].id])
          this.columnsGroup[x].values[this.cuboCuotaInicial[i][this.columnsGroup[x].id]] = 1;
      }
    }
    
    //Resumen
    this.resumenMunicipio = this._cubocuotaService.getResumenMunicipio(
                              this.cuboCuotaInicial,this.columnsGroup);
    this.tipoGravamen = this.resumenMunicipio.TIPO_GRAVAMEN;
    //this.__refreshAll();

    let c = this.charts.find((c) => c.id === 'chart1');
    //this._store.dispatch(new cubo.FilteredCuboAction(this.cuboCuotaInicial));
    
    //this.cubo$ = this._store.select(fromRoot.getCuboEntities);

    //this.cubo$.subscribe((data : Array<ICubo_Couta>) => 
    //            { console.log(data); });

    //console.log(c);

  }

  

  private __ejectDispatchInitial(){
      //this._store.dispatch(new cubo.LoadCuboAction(this.cuboCuotaInicial));
  }

  private __refreshAll(){

     //this.cubo$ = this.store.select(fromRoot.getCuboEntities);

     this.cuboCuotaFiltrado = this._cubocuotaService.getCuboFiltrado(
       this.cuboCuotaInicial,
       this.columnsGroup
     );
     this.parseChart();
  }

  

  private parseChart() {
    let indexGroup : number = this.columnsGroup.findIndex((idx) => { return idx.display === true })
    let series: any[] = [];

    /*add only unique series
    let uniqueSeries = {};
    this.charts.forEach((charting) => {
      if(charting.series){
        charting.series.forEach((s) => { uniqueSeries[s] = 1; })
      }      
    });*/
    
    if (indexGroup !== -1) {
      let keysColumns = this.keys(this.columnsGroup[indexGroup].values); //Sample: CON, FCS, FRR, etc...
      
      //Adding a Serie
      let currentLabel = this.columnsGroup[indexGroup].name;

      this.columnsQuantity.forEach((serie) => {
        series.push({data: Array.from({length: keysColumns.length}, () => 0), 
                     label: currentLabel + " - " + serie.id, column: serie.id }); //Sum_Cuota, etc...
      });

      //recalculate el resumen para el actual Filtrado
      this.resumenFiltrado = this._cubocuotaService.getDefaultResumen();
      this.resumenFiltrado.TIPO_GRAVAMEN = this.tipoGravamen;

      for (var rowCol = 0, j = keysColumns.length; rowCol !== j; rowCol++) {
        for (var x = 0, y = this.cuboCuotaFiltrado.length; x != y; x++){          
          if(keysColumns[rowCol] == this.cuboCuotaFiltrado[x][this.columnsGroup[indexGroup].id]) {

            //Update "Quantity Value"
            series.forEach((serie) => {
                //Validar si la columna es "SUM_CUOTA" para aplicar el gravamen
                let datoColumn = this.cuboCuotaFiltrado[x][serie.column];
                if(serie.column === "SUM_CUOTA")
                {
                  datoColumn = (this.tipoGravamen / 100) * this.cuboCuotaFiltrado[x]['SUM_V_CATASTR'];
                  //this.resumenFiltrado.SUM_CUOTA += datoColumn;
                }                
                serie.data[rowCol] = datoColumn;
                this.resumenFiltrado[serie.column] += datoColumn; 
            });
            break;
          }
        }
      }

      //console.log(this.resumenFiltrado);

      //Adding to container
      this.containerChart = { 
            names : this.keys(this.columnsGroup[indexGroup].values).map((el) => { return el.substring(0, 40) }), 
            series:  series
          }
      
      //Refresh all Chart
      this.charts.forEach((charting) => {
        charting.refresh(this.containerChart);
      });
      
    }
  }

  keys(currentDict: any) : Array<string> {
    return Object.keys(currentDict);
  }

}
