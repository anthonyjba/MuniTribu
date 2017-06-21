import { Component, OnInit, ViewEncapsulation, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';

//app
import { COLUMNS_GROUP, COLUMNS_QUANTITY  } from './shared/config';
import { IDefault, IColumns, ICubo_Couta } from './shared/interfaces';
import { CuboCuotaService } from './services/cubo-cuota.service';
import { getDictionary } from './services/dictionary.service';
import { Dictionary } from './shared/enums'

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { SimpleNgrx } from './containers/chart.container';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

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

  protected searchStr: string;
  private dataService: CompleterData;
  protected selmuni: string = "45002";
  
  @ViewChild(SimpleNgrx) appContainer: SimpleNgrx;

  //Default Values
  

  constructor(private _cubocuotaService: CuboCuotaService,              
              private completerService: CompleterService) {
      this.resumenMunicipio = _cubocuotaService.getDefaultResumen();
      let munis = getDictionary(Dictionary.Municipio)
      let source = Observable.from([munis]).delay(0);
      this.dataService = completerService.local(<Observable<any[]>>source, "name", "name").descriptionField("id");
  }

  ngOnInit(){
    //this.resetStoreApp();
  }

  /*ngAfterContentInit() { console.log("ngAfterContentInit"); }
    ngAfterViewInit() { console.log("ngAfterViewInit APP"); }*/

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

  protected onSelected(item: CompleterItem) {
    this.selmuni = item? (!item.description ? "45900": item.description) : "";
    if(this.selmuni) {
      this.resetStoreApp();}
  }

  protected resetStoreApp() {
    this._cubocuotaService.getCubo(this.selmuni)
        .subscribe((data : Array<ICubo_Couta>) => this.cuboCuotaInicial = data,
                error => console.log(error),
                () => this.__extractDictionary());
  }
  
}
