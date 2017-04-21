import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cat-sortable-group',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sortable-group.component.html',
  styleUrls: ['./sortable-group.component.css']
})
export class SortableGroupComponent {

  @Input()
  sortItems: Array<any> ;

  @Output()
  sorting: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();

  @Output()
  toggleItem: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  refresh() {
    this.sorting.emit(this.sortItems);
  }

  toggle(target: any) {
    
    this.toggleItem.emit(target.id);
    //let reg = this.sortItems.find((item) => item.id === target.id);
    //reg.display = target.checked; 
    
    //this.change.emit(this.sortItems);
  }

}
