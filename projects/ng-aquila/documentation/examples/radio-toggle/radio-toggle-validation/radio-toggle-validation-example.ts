import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import {
    NxRadioToggleButtonComponent,
    NxRadioToggleComponent,
} from '@aposin/ng-aquila/radio-toggle';

/**
 * @title Validation Example
 */
@Component({
    selector: 'radio-toggle-validation-example',
    templateUrl: './radio-toggle-validation-example.html',
    styleUrls: ['./radio-toggle-validation-example.css'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NxRadioToggleComponent,
        NxRadioToggleButtonComponent,
        NxButtonComponent,
        JsonPipe,
    ],
})
export class RadioToggleValidationExampleComponent {
    readonly data = ['A', 'B', 'C'];

    readonly testForm = this.fb.group({
        testToggle: ['', this.customValidation],
    });

    isSubmitted = false;

    constructor(private readonly fb: FormBuilder) {}

    private customValidation(formGroup: FormGroup) {
        return formGroup.value !== 'B' ? { valid: false } : null;
    }

    onsubmit() {
        this.isSubmitted = true;
    }
}
