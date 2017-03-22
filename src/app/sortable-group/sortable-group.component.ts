import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';

import { Columns  } from '../shared/config'; 

@Component({
  selector: 'sortable-group',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sortable-group.component.html',
  styleUrls: ['./sortable-group.component.css']
})
export class SortableGroupComponent implements OnInit {

  sortColumns = Columns;

  @Output()
  change: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();

  constructor() { }

  ngOnInit() {
  }

  refresh(event: any){
    this.change.emit(this.sortColumns);
  }

  onChange(elem) {
    console.log(elem);
    
    /*let reg = this.sortColumns.find((item) => item.id === elem.target.id);
    reg.selected = elem.target.checked; 
    
    this.displayCubo();*/
  }

}
