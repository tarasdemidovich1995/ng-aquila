import { Component } from '@angular/core';
import {
    DataDisplayDefaultOptions,
    DATA_DISPLAY_DEFAULT_OPTIONS,
} from '@aposin/ng-aquila/data-display';

const options: DataDisplayDefaultOptions = {
    size: 'medium', // expert mode default size
};

/**
 * @title Expert data display example
 */
@Component({
    selector: 'data-display-expert-example',
    templateUrl: './data-display-expert-example.html',
    styleUrls: ['./data-display-expert-example.css'],
    providers: [
        {
            provide: DATA_DISPLAY_DEFAULT_OPTIONS,
            useValue: options,
        },
    ],
})
export class DataDisplayExpertExampleComponent {}
