import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

//app
import { IMunicipio, IDefault, IColumns, ICubo_Couta } from './shared/interfaces';
import * as DictionaryModule from './shared/services/dictionary.service';
import { CuboCuotaService } from './shared/services/cubo-cuota.service';
import { Dictionary } from './shared/enums';
import { Columns  } from './shared/config';

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
  municipios: Array<IMunicipio>
  cuboCuotaInicial: Array<ICubo_Couta>;
  cuboCuotaFiltrado: Array<ICubo_Couta>;
  cuboCuotaResumen: ICubo_Couta;
  cultivos: Array<IDefault>;
  columnsGroup : Array<IColumns> = Columns;
  
  //Dictionares group
  dg_AC = {};
  dg_TIPO_CIF = {};
  dg_TALLA = {};
  dg_IP = {};
  dg_IPP = {};
  
  //Filters Acummulative
  fg_AC = {};
  fg_TIPO_CIF = {};
  fg_TALLA = {};
  fg_IP = {};
  fg_IPP = {};
  
  //Default Values
  selmuni: string = "45900";
  selNivel: string = "AC";  
  public oneAtATime: boolean = true; //Accordion
  

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
    
    this.cultivos = DictionaryModule.getDictionary(Dictionary.Cultivos);
  }

  keys(currentDict: any) : Array<string> {
    return Object.keys(currentDict);
  }

  extractDictionary(){
    for (var i = 0, j = this.cuboCuotaInicial.length; i !== j; i++) {
      for (var x = 0, y = this.columnsGroup.length; x != y; x++){
        if(this.cuboCuotaInicial[i][this.columnsGroup[x].id])
          this.columnsGroup[x].filters[this.cuboCuotaInicial[i][this.columnsGroup[x].id]] = 1;
      }
    }
          
      /*this.dg_AC[this.cuboCuotaInicial[i].AC] = 1;
      this.dg_TIPO_CIF[this.cuboCuotaInicial[i].TIPO_CIF] = 1;
      this.dg_TALLA[this.cuboCuotaInicial[i].TALLA] = 1;
      this.dg_IP[this.cuboCuotaInicial[i].IP] = 1;
      this.dg_IPP[this.cuboCuotaInicial[i].IPP] = 1;

    delete this.dg_AC[null];
    delete this.dg_TIPO_CIF[null];
    delete this.dg_TALLA[null];
    delete this.dg_IP[null];
    delete this.dg_IPP[null];*/
    console.log(this.columnsGroup);
    this.displayCubo();
  }

  onChange(elem) {
    //let reg = this.columnsGroup.find((item) => item.id === elem.target.id);
    //reg.selected = elem.target.checked; 
    
    this.displayCubo();
  }

  updateColumns(result){
    this.columnsGroup = result;
    console.log("new listGroup");
    console.log(this.columnsGroup);
  }

  onClick(event) {
    let dictCurrent = {};
    
    switch(event.target.name) {
      case "AC": 
        dictCurrent = this.fg_AC;
        break;
      case "TIPO_CIF":
        dictCurrent = this.fg_TIPO_CIF;
        break;
      case "TALLA":
        dictCurrent = this.fg_TALLA;
        break;
      case "IP":
        dictCurrent = this.fg_IP;
        break;
      case "IPP":
        dictCurrent = this.fg_IPP;
        break;
    }

    if (dictCurrent.hasOwnProperty(event.target.id)){
      delete dictCurrent[event.target.id];
      event.currentTarget.classList.remove("active-widget");
      }
    else{
      dictCurrent[event.target.id] = 1;
      event.currentTarget.classList.add("active-widget");
    }

    //refresh display filter
    this.cuboCuotaFiltrado = this.applyFilter(this.cuboCuotaInicial);
  }

  

  displayCubo() {
    let resumen = this.cuboCuotaInicial.filter(f => 
            { return f.AC === null &&
                      f.IP === null &&
                      f.IPP === null &&
                      f.TALLA === null &&
                      f.TIPO_CIF === null 
            });
    
    this.cuboCuotaResumen = resumen[0];
    this.cuboCuotaFiltrado = this.applyFilter(this.cuboCuotaInicial);
  }

  private applyFilter(DataCube){
    let res = [];

    for (var i = 0, j = DataCube.length; i !== j; i++) {
      if(  
          (this.columnsGroup[0].display ? DataCube[i].AC !== null : DataCube[i].AC === null) &&
          (Object.getOwnPropertyNames(this.fg_AC).length === 0 || this.fg_AC[DataCube[i].AC]) && 
          (this.columnsGroup[1].display ? DataCube[i].TIPO_CIF !== null : DataCube[i].TIPO_CIF === null) &&
          (Object.getOwnPropertyNames(this.fg_TIPO_CIF).length === 0 || this.fg_TIPO_CIF[DataCube[i].TIPO_CIF]) &&
          (this.columnsGroup[2].display ? DataCube[i].TALLA !== null : DataCube[i].TALLA === null) &&
          (Object.getOwnPropertyNames(this.fg_TALLA).length === 0 || this.fg_TALLA[DataCube[i].TALLA]) &&
          (this.columnsGroup[3].display ? DataCube[i].IP !== null : DataCube[i].IP === null) &&
          (Object.getOwnPropertyNames(this.fg_IP).length === 0 || this.fg_IP[DataCube[i].IP]) &&
          (this.columnsGroup[4].display ? DataCube[i].IPP !== null : DataCube[i].IPP === null) &&
          (Object.getOwnPropertyNames(this.fg_IPP).length === 0 || this.fg_IPP[DataCube[i].IPP])
          )  
          { res.push(DataCube[i]); }
    }

    //console.log(res.length);
    return res;
  }

  
  

}
