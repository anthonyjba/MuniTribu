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
    let n=0; this.sortItems.forEach((e)=> { e.display? n++ : 0 });
    if(n > 1 && target.checked) {
      alert("No se puede seleccionar mas de 2 niveles");
      target.checked = false;
      return;
    }
    this.toggleItem.emit({ id: target.id, display: target.checked });
  }

}
