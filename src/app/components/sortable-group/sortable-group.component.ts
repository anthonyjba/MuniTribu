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
  toggleItem: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() { }

  refresh() {
    this.sorting.emit(this.sortItems);
  }

  toggle(target: any) {   
    this.toggleItem.emit({ id: target.id, display: target.checked });
  }

}
