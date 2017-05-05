import { Component, OnInit, ViewEncapsulation, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';

//app
import { COLUMNS_GROUP, COLUMNS_QUANTITY  } from './shared/config';
import { IDefault, IColumns, ICubo_Couta } from './shared/interfaces';
import { CuboCuotaService } from './services/cubo-cuota.service';

import { SimpleNgrx } from './containers/chart.container';

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
  resumenMunicipio: ICubo_Couta;
  columnsGroup: Array<IColumns> = COLUMNS_GROUP;
  
  @ViewChild(SimpleNgrx) appContainer: SimpleNgrx;

  //Default Values
  selmuni: string = "45900";
  

  constructor(private _cubocuotaService: CuboCuotaService) {
      this.resumenMunicipio = _cubocuotaService.getDefaultResumen();
  }

  ngOnInit(){
    //this.municipios = DictionaryModule.getDictionary(Dictionary.Municipio);

    this._cubocuotaService.getCubo()
        .subscribe((data : Array<ICubo_Couta>) => this.cuboCuotaInicial = data,
                error => console.log(error),
                () => this.__extractDictionary());

  }

  ngAfterContentInit() { console.log("ngAfterContentInit"); }

  ngAfterViewInit() { console.log("ngAfterViewInit APP"); }

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
    let gravamenMunicipio = this.resumenMunicipio.TIPO_GRAVAMEN;

    //Asign and initialize in Chart Container
    this.appContainer.loadCuboInicial(this.cuboCuotaInicial, gravamenMunicipio, this.columnsGroup);
  }

  
/*
  private __refreshAll(){

     //this.cubo$ = this.store.select(fromRoot.getCuboEntities);

     this.cuboCuotaFiltrado = this._cubocuotaService.getCuboFiltrado(
       this.cuboCuotaInicial,
       this.columnsGroup,
       ['AC']
     );
     //this.parseChart();
  }
*/
  
  /*
  private parseChart() {
    let indexGroup : number = this.columnsGroup.findIndex((idx) => { return idx.display === true })
    let series: any[] = [];

    //add only unique series
    //let uniqueSeries = {};
    //this.charts.forEach((charting) => {
    //  if(charting.series){
    //    charting.series.forEach((s) => { uniqueSeries[s] = 1; })
    //  }      
    //});
    
    if (indexGroup !== -1) {
      let keysColumns = this.keys(this.columnsGroup[indexGroup].values); //Sample: CON, FCS, FRR, etc...
      
      //Adding a Serie
      let currentLabel = this.columnsGroup[indexGroup].name;

      this.columnsQuantity.forEach((serie) => {
        series.push({data: Array.from({length: keysColumns.length}, () => 0), 
                     label: currentLabel + " - " + serie.id, column: serie.id }); //Sum_Cuota, etc...
      });

      //recalculate el resumen para el actual Filtrado
      //this.resumenFiltrado = this._cubocuotaService.getDefaultResumen();
      //this.resumenFiltrado.TIPO_GRAVAMEN = this.tipoGravamen;

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
                //this.resumenFiltrado[serie.column] += datoColumn; 
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
      //this.charts.forEach((charting) => {
      //  charting.refresh(this.containerChart);
      //});
      
    }
  }

  keys(currentDict: any) : Array<string> {
    return Object.keys(currentDict);
  }*/
  
}
