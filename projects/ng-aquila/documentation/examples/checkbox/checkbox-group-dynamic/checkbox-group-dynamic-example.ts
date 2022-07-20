import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @title Checkbox group dynamic checkboxes example
 */
@Component({
    selector: 'checkbox-group-dynamic-example',
    templateUrl: './checkbox-group-dynamic-example.html',
    styleUrls: ['./checkbox-group-dynamic-example.css'],
})
export class CheckboxGroupDynamicExampleComponent {
    myFormGroup: FormGroup;
    data = ['one', 'two', 'three'];
    i = 1;

    constructor(private fb: FormBuilder) {
        this.myFormGroup = this.fb.group({
            terms: [[], Validators.required],
        });
    }

    addNewCb() {
        this.data.push('Checkbox ' + this.i);
        this.i++;
    }

    removeCB() {
        this.data.shift();
    }
}
