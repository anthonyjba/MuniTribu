import { Component, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';

import { Columns  } from '../shared/config'; 

@Component({
  selector: 'sortable-group',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sortable-group.component.html',
  styleUrls: ['./sortable-group.component.css']
})
export class SortableGroupComponent {

  sortColumns = Columns;

  @Output()
  change: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();

  constructor() { }

  refresh(){
    this.change.emit(this.sortColumns);
  }

  toggle(target: any) {
    let reg = this.sortColumns.find((item) => item.id === target.id);
    reg.display = target.checked; 
    
    this.change.emit(this.sortColumns);
  }

}
