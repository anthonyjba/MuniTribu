import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AccordionModule } from 'ng2-bootstrap';
import { DndModule } from 'ng2-dnd';
import { ChartsModule } from 'ng2-charts';
import { TruncatePipe } from './shared/truncate.pipe';

//Catastro Services
import { CuboCuotaService } from './services/cubo-cuota.service'

//Catastro Components
import { ChartComponent } from './components/chart/chart.component';
import { CounterComponent } from './components/counter/counter.component';
import { SortableGroupComponent } from './components/sortable-group/sortable-group.component';

@NgModule({
  declarations: [
    AppComponent,
    SortableGroupComponent,
    ChartComponent,
    CounterComponent,
    TruncatePipe    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    DndModule.forRoot(),
    AccordionModule.forRoot()    
  ],  
  providers: [
    CuboCuotaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
