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
    this._cubocuotaService.getCubo()
        .subscribe((data : Array<ICubo_Couta>) => this.cuboCuotaInicial = data,
                error => console.log(error),
                () => this.__extractDictionary());

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
  
}
