import { Component, Input } from '@angular/core';

@Component({
  selector: 'chart-list',
  template: `
    <h1>{{ cubos }}</h1>
  `,
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `]
})
export class ChartListComponent {
  @Input() cubos: any[];

  constructor(){

  }
}
