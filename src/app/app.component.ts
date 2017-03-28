import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

//app
import { IDefault, IColumns, ICubo_Couta } from './shared/interfaces';
import * as DictionaryModule from './shared/services/dictionary.service';
import { CuboCuotaService } from './shared/services/cubo-cuota.service';
import { Dictionary } from './shared/enums';
import { Columns  } from './shared/config';

import { ChartBarComponent } from './chart-bar/chart-bar.component';

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
  cuboCuotaResumen: ICubo_Couta;
  columnsGroup: Array<IColumns> = Columns;
  containerChart = { names : [], series: [{data: [], label: 'Series A'}] };
  //cultivos: Array<IDefault>;

  @ViewChild(ChartBarComponent) chartbar : ChartBarComponent;

  //Default Values
  selmuni: string = "45900";
  uniqueAccordion: boolean = true;
  public customClass: string = 'customClass';

  constructor(private cubocuotaService: CuboCuotaService) {
      this.cuboCuotaResumen = { MUNI: this.selmuni, AC: null, IP: null, IPP: null, TALLA: null, TIPO_CIF: null, 
              N_SUBPARC: 0, N_PROPIETARIOS: 0, SUM_HECT: 0, SUM_V_CATASTR: 0, TIPO_GRAVAMEN: 0, SUM_CUOTA: 0};
  }

  ngOnInit(){
    
    this.municipios = DictionaryModule.getDictionary(Dictionary.Municipio);
    this.cubocuotaService.getCubo()
        .subscribe((data : Array<ICubo_Couta>) => this.cuboCuotaInicial = data,
                error => console.log(error),
                () => this.extractDictionary());
    
    //this.cultivos = DictionaryModule.getDictionary(Dictionary.Cultivos);
  }

  keys(currentDict: any) : Array<string> {
    return Object.keys(currentDict);
  }

  extractDictionary(){
    for (var i = 0, j = this.cuboCuotaInicial.length; i !== j; i++) {
      for (var x = 0, y = this.columnsGroup.length; x != y; x++){
        if(this.cuboCuotaInicial[i][this.columnsGroup[x].id])
          this.columnsGroup[x].values[this.cuboCuotaInicial[i][this.columnsGroup[x].id]] = 1;
      }
    }
          
    this.__displayResumen();
  }

  updateColumns(result : Array<IColumns>){
    //Verificar porque repite esta funcion 2 veces
    if(result.length > 0) {
        this.columnsGroup = result;

        //refresh display filter
        this.__refreshAll();
    }    
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

  __refreshAll(){
     this.cuboCuotaFiltrado = this.__updateTablacubo();
     this.parseChart();
  }

  __displayResumen() {

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
    
    this.cuboCuotaResumen = resumen[0];    
    this.__refreshAll();    
  }

  __updateTablacubo() {
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

    //console.log(result.length);    
    return result;
  }

  parseChart() {
    let indexColumn : number = -1; 
    for (var a = 0, b = this.columnsGroup.length; a < b; a++) {
      if (this.columnsGroup[a].display) { indexColumn = a; break; } 
    } 
     
    if (indexColumn !== -1) {
      let keysColumns = this.keys(this.columnsGroup[indexColumn].values);
      let series: any[] = [];
      let values :any[] = [];
      
      for (var i = 0, j = keysColumns.length; i !== j; i++) {
        let num = 0;
        for (var x = 0, y = this.cuboCuotaFiltrado.length; x != y; x++){          
          if(keysColumns[i] === this.cuboCuotaFiltrado[x][this.columnsGroup[indexColumn].id]) {
            num = this.cuboCuotaFiltrado[x]['SUM_HECT'];            
            break;
          }
        }
        values.push(num);
      }
      series.push({data: values, label: 'Series ABC'});
      
      this.containerChart = { 
            names : this.keys(this.columnsGroup[0].values), 
            series:  series
          }
      
      this.chartbar.dataLabels = this.containerChart.names;
      this.chartbar.dataset = this.containerChart.series;

      this.chartbar.chartReload();

    }

    
  }


}
