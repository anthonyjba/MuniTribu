import { Component, OnInit, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';

//app
import { IDefault, IColumns, ICubo_Couta } from './shared/interfaces';
import * as DictionaryModule from './shared/services/dictionary.service';
import { CuboCuotaService } from './shared/services/cubo-cuota.service';
import { Dictionary } from './shared/enums';
import { COLUMNS_GROUP, COLUMNS_QUANTITY  } from './shared/config';
import { ChartComponent } from './chart/chart.component';


@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.components2.css']
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
  customClass: string = 'customClass';
  RESUMEM_DEFAULT = { MUNI: this.selmuni, 
              N_SUBPARC: 0, N_PROPIETARIOS: 0, SUM_HECT: 0, SUM_V_CATASTR: 0, TIPO_GRAVAMEN: 0, SUM_CUOTA: 0};

  constructor(private _cubocuotaService: CuboCuotaService) {
      this.resumenMunicipio = this.resumenFiltrado = Object.assign({}, this.RESUMEM_DEFAULT ); 
  }

  ngOnInit(){
    
    this.municipios = DictionaryModule.getDictionary(Dictionary.Municipio);
    this._cubocuotaService.getCubo()
        .subscribe((data : Array<ICubo_Couta>) => this.cuboCuotaInicial = data,
                error => console.log(error),
                () => this.__extractDictionary());
  }

  ngAfterContentInit() { console.log("ngAfterContentInit"); }

  ngAfterViewInit() { console.log("ngAfterViewInit"); 
    

    this.selectElRef.forEach((el) => {
      let options = el.nativeElement.options;
      if( el.nativeElement.id ){
        let currentChart = this.charts.find((c) => c.id === el.nativeElement.id.substr(2));
        for(let i=0; i < options.length; i++) {
          options[i].selected = currentChart.series.join(',').indexOf(options[i].value) > -1;
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

    currentChart.series = Array.apply(null, el.options)
      .filter(option => option.selected)
      .map(option => option.value)
    
    currentChart.refresh(this.containerChart);
  }

  onChangeTipoGrav(value: number) {
    console.log(value);
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
    for (var i = 0, j = this.cuboCuotaInicial.length; i !== j; i++) {
      for (var x = 0, y = this.columnsGroup.length; x != y; x++){
        if(this.cuboCuotaInicial[i][this.columnsGroup[x].id])
          this.columnsGroup[x].values[this.cuboCuotaInicial[i][this.columnsGroup[x].id]] = 1;
      }
    }
          
    this.__displayResumen();
  }

  private __refreshAll(){
     this.cuboCuotaFiltrado = this.__updateTablacubo();
     this.parseChart();
  }

  private __displayResumen() {

    let resumen = []; 
    for (var i = 0, j = this.cuboCuotaInicial.length; i !== j; i++) {
      let flag = true;
      for (var x = 0, y = this.columnsGroup.length; x != y; x++){
        if(this.cuboCuotaInicial[i][this.columnsGroup[x].id] !== null){
          flag = false;
          break;
          }
      }
      if(flag)
        resumen.push(this.cuboCuotaInicial[i]);
    }
    
    this.resumenMunicipio = resumen[0];
    this.tipoGravamen = this.resumenMunicipio.TIPO_GRAVAMEN;
    this.__refreshAll();    
  }

  private __updateTablacubo() {
    let result = [];
    let cube = this.cuboCuotaInicial;

    for (var i = 0, j = cube.length; i !== j; i++) {
      let flag = false;
      for (var x = 0, y = this.columnsGroup.length; x != y; x++){
        if(
            (this.columnsGroup[x].display ? cube[i][this.columnsGroup[x].id] !== null : cube[i][this.columnsGroup[x].id] === null) &&
            (Object.getOwnPropertyNames(this.columnsGroup[x].filters).length === 0 || 
              this.columnsGroup[x].filters[cube[i][this.columnsGroup[x].id]])
          )
          flag = true;
        else { 
          flag = false;
          break;
        }  
      }
      if(flag)
        result.push(this.cuboCuotaInicial[i]);
    }

    return result;
  }

  private parseChart() {
    let indexGroup : number = this.columnsGroup.findIndex((idx) => { return idx.display === true })
    let series: any[] = [];

    console.log(indexGroup);

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
      this.resumenFiltrado = Object.assign({}, this.RESUMEM_DEFAULT );
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
