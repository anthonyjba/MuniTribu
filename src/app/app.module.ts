import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

//Modules vendors
import { AppComponent } from './app.component';
import { AccordionModule } from 'ng2-bootstrap';
import { DndModule } from 'ng2-dnd';
import { ChartsModule } from 'ng2-charts';

//Pipes
import { TruncatePipe } from './shared/truncate.pipe';

//Catastro Reducers
import rootReducer from './reducers/index';

//Catastro Services
import { CuboCuotaService } from './services/cubo-cuota.service'

//Catastro Components
import { SimpleNgrx } from './containers/chart.container'
import { ChartComponent } from './components/chart/chart.component';
import { CounterComponent } from './components/counter/counter.component';
//import { SortableGroupComponent } from './components/sortable-group/sortable-group.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleNgrx,
    CounterComponent,
    TruncatePipe,    
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, 
    ChartsModule,
    DndModule.forRoot(),
    AccordionModule.forRoot(),
    StoreModule.provideStore(rootReducer),
    
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    })
  ],  
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    CuboCuotaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
