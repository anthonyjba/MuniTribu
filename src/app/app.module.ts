import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AccordionModule } from 'ng2-bootstrap';
import { CuboCuotaService } from './shared/services/cubo-cuota.service'
import { DndModule } from 'ng2-dnd';
import { TruncatePipe } from './shared/truncate.pipe';


@NgModule({
  declarations: [
    AppComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DndModule.forRoot(),
    AccordionModule.forRoot()    
  ],
  providers: [
    CuboCuotaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
