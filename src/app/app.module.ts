import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AccordionModule } from 'ng2-bootstrap';
import { CuboCuotaService } from './shared/services/cubo-cuota.service'
import { DndModule } from 'ng2-dnd';
import { TruncatePipe } from './shared/truncate.pipe';
import { SortableGroupComponent } from './sortable-group/sortable-group.component';
import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    TruncatePipe,
    SortableGroupComponent,
    ChartComponent
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
