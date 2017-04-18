import { Component, Input } from '@angular/core';

@Component({
  selector: 'chart-list',
  template: `
    <h1><ul>
    <li>{{ cubos.entities[0]["N_PROPIETARIOS"] }}</li>
    <li>{{ cubos.entities[0]["SUM_HECT"] }}</li>
    <li>{{ cubos.entities[0]["SUM_V_CATASTR"] }}</li>
    <li>{{ cubos.entities[0]["TIPO_GRAVAMEN"] }}</li>
    </ul></h1>
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
  @Input() cubos;

  constructor(){

  }
}
