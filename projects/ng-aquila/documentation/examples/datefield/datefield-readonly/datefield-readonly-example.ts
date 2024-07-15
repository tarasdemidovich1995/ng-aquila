import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    NxDateAdapter,
    NxDatefieldDirective,
    NxDatepickerComponent,
    NxDatepickerToggleComponent,
} from '@aposin/ng-aquila/datefield';
import { NxFormfieldComponent } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';

/**
 * @title Datefield readonly example
 */
@Component({
    selector: 'datefield-readonly-example',
    standalone: true,
    templateUrl: './datefield-readonly-example.html',
    styleUrls: ['./datefield-readonly-example.css'],
    imports: [
        NxFormfieldComponent,
        NxDatepickerToggleComponent,
        NxDatepickerComponent,
        NxDatefieldDirective,
        FormsModule,
        NxInputModule,
    ],
})
export class DatefieldReadonlyExample {
    adapter = inject(NxDateAdapter);
    currentDate = this.adapter.today();
}
