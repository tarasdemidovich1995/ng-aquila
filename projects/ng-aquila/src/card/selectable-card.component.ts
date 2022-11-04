import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    InjectionToken,
    Input,
    OnDestroy,
    Optional,
    Output,
    QueryList,
    Self,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm, UntypedFormControl } from '@angular/forms';
import { NxErrorComponent } from '@aposin/ng-aquila/base';
import { ErrorStateMatcher } from '@aposin/ng-aquila/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NxSelectableCardChangeEvent } from './selectable-card-change-event';

let nextId = 0;

export type NxSelectableCardAppearance = 'expert' | 'default';

/**
 * Represents the default options for the selectable card.
 * It can be configured using the `NX_SELECTABLE_CARD_DEFAULT_OPTIONS` injection token.
 */
export interface SelectableCardDefaultOptions {
    /**
     * Sets the default appearance (optional).
     */
    appearance?: NxSelectableCardAppearance;
}

export const SELECTABLE_CARD_DEFAULT_OPTIONS = new InjectionToken<SelectableCardDefaultOptions>('SELECTABLE_CARD_DEFAULT_OPTIONS');

@Component({
    selector: 'nx-selectable-card',
    templateUrl: './selectable-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./selectable-card.component.scss'],
    host: {
        '[class.is-disabled]': 'disabled',
        '[class.has-error]': '_errorState',
        '[attr.aria-invalid]': '_errorState',
        'attr.role': 'checkbox',
        '[attr.aria-checked]': 'checked',
    },
})
export class NxSelectableCardComponent implements ControlValueAccessor, DoCheck, AfterContentInit, OnDestroy, AfterViewInit {
    _errorListIds = '';

    @ContentChildren(NxErrorComponent) _errorList!: QueryList<NxErrorComponent>;

    @ViewChild('input') _nativeInput!: ElementRef<HTMLElement>;

    _errorState = false;

    /** An event is dispatched each time the selectable card value is changed */
    @Output() readonly selectionChange = new EventEmitter<NxSelectableCardChangeEvent>();

    /** An event is dispatched each time the selectable card value is changed */
    @Output() readonly checkedChange = new EventEmitter<boolean>();

    /**
     * **Expert option**
     *
     * Sets the appearance of the small stage. Default: 'default'.
     */
    @Input() set appearance(value: NxSelectableCardAppearance) {
        if (value !== this.appearance) {
            this._appearance = value;
            this._cdr.markForCheck();
        }
    }
    get appearance(): NxSelectableCardAppearance {
        return this._appearance || this._defaultOptions?.appearance || 'default';
    }
    private _appearance?: NxSelectableCardAppearance;

    /**
     * Id of the selectable card.
     *
     * If not set, the selectable card gets an incremented value by default.
     */
    @Input() set id(value: string) {
        if (value !== this._id) {
            this._id = value;
            this._cdr.markForCheck();
        }
    }
    get id() {
        return this._id;
    }
    private _id = `nx-selectable-card-${nextId++}`;

    /** Whether the selectable card  is checked. */
    @Input() set checked(value: BooleanInput) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._checked) {
            this._checked = newValue;
            this._cdr.markForCheck();
        }
    }
    get checked(): boolean {
        return this._checked;
    }
    private _checked = false;

    /** The value attribute of the native input element  */
    @Input() set value(value: string) {
        if (value) {
            this._value = value;
        }

        this._cdr.markForCheck();
    }
    get value(): string {
        return this._value;
    }
    private _value = '';

    /** Whether the selectable card is disabled. */
    @Input() set disabled(value: BooleanInput) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this._cdr.markForCheck();
        }
    }
    get disabled(): boolean {
        return this._disabled;
    }
    private _disabled = false;

    /**
     * Whether the selectable card is negative.
     *
     * @deprecated Obsolete as negative state is not implemented.
     * @deletion-target 12.0.0
     */
    @Input() set negative(value: BooleanInput) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._negative) {
            this._negative = newValue;
            this._cdr.markForCheck();
        }
    }
    get negative(): boolean {
        return this._negative;
    }
    private _negative = false;

    /** Whether the selectable card is required. */
    @Input() set required(value: BooleanInput) {
        this._required = coerceBooleanProperty(value);
    }
    get required(): boolean {
        return !!this._required;
    }
    private _required?: boolean;

    /** Name of the selectable card. */
    @Input() set name(value: string) {
        this._name = value;
    }
    get name(): string {
        return this._name;
    }
    private _name = '';

    /** The tabindex of the selectable card. */
    @Input() set tabindex(value: string) {
        this._tabindex = value;
    }
    get tabindex(): string {
        if (this.disabled) {
            return '-1';
        }
        return this._tabindex;
    }
    private _tabindex = '0';

    @HostBinding('class.is-expert') get _isExpert() {
        return this.appearance === 'expert';
    }

    private readonly _destroyed = new Subject<void>();

    constructor(
        private readonly _cdr: ChangeDetectorRef,
        private readonly _errorStateMatcher: ErrorStateMatcher,
        @Optional() @Self() readonly ngControl: NgControl | null,
        @Optional() private readonly _parentForm: NgForm | null,
        @Optional() private readonly _parentFormGroup: FormGroupDirective | null,
        private readonly _focusMonitor: FocusMonitor,
        @Optional() @Inject(SELECTABLE_CARD_DEFAULT_OPTIONS) private readonly _defaultOptions: SelectableCardDefaultOptions | null,
    ) {
        if (this.ngControl) {
            // Note: we provide the value accessor through here, instead of
            // the `providers` to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }
    }

    ngAfterViewInit(): void {
        this._focusMonitor.monitor(this._nativeInput);
    }

    ngAfterContentInit(): void {
        this._errorList.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
            this._errorListIds = this._getErrorListIds();
            this._cdr.markForCheck();
        });

        this._errorListIds = this._getErrorListIds();
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
        this._focusMonitor.stopMonitoring(this._nativeInput);
    }

    /** @docs-private */
    onChangeCallback = (_: any) => {};

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    onTouchedCallback = (_: any) => {};

    registerOnTouched(onTouched: any): void {
        this.onTouchedCallback = onTouched;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(value: any): void {
        this.checked = !!value;
    }

    ngDoCheck(): void {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribed to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this._updateErrorState();
        }
    }

    _updateErrorState() {
        const oldState = this._errorState;
        const parent = this._parentFormGroup || this._parentForm;
        const control = this.ngControl ? (this.ngControl.control as UntypedFormControl) : null;
        const newState = this._errorStateMatcher.isErrorState(control, parent);

        if (newState !== oldState) {
            this._errorState = newState;
            this._cdr.markForCheck();
        }
    }

    /** Toggles the checked state of the selectable card . */
    toggle() {
        if (!this.disabled) {
            this.checked = !this.checked;
        }
    }

    _onInputClick(event: Event): void {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // stop the propagation of the native click on the checkbox input so that a click is not triggered twice
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
        if (!this.disabled) {
            this.toggle();
            this._emitChangeEvent();
        }
    }

    _onInteractionEvent(event: Event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
    }

    private _emitChangeEvent() {
        const event = new NxSelectableCardChangeEvent(this.checked, this.value, this);
        this.onChangeCallback(this.checked);
        this.selectionChange.emit(event);
        this.checkedChange.emit(this.checked);
    }

    private _getErrorListIds(): string {
        return this._errorList.map((errorItem: NxErrorComponent) => errorItem.id).join(' ');
    }
}
