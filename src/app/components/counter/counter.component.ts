import { Component, Input } from '@angular/core';

@Component({
    selector: 'cat-counter',
    templateUrl: 'counter.component.html',
    styleUrls: ['./counter.component.css']
})
export class CounterComponent {

    @Input()
    value: number;

    @Input()
    format: string;

    @Input()
    fontIcon: string;

    @Input()
    description: string;

    constructor() {}
}