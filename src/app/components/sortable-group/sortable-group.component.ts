import { Component, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';

import { COLUMNS_GROUP  } from '../../shared/config'; 

@Component({
  selector: 'cat-sortable-group',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sortable-group.component.html',
  styleUrls: ['./sortable-group.component.css']
})
export class SortableGroupComponent {

  sortColumns = COLUMNS_GROUP;

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
