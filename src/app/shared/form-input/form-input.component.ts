import {
  Component,
  forwardRef,
  Input
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-form-input',

  standalone: true,

  templateUrl: './form-input.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => FormInput
      ),
      multi: true
    }
  ]
})
export class FormInput
  implements ControlValueAccessor {

  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() id = '';
  @Input() invalid = false;
  @Input() errorMessage = '';

  value = '';
  disabled = false;

  private onChange =
    (value: string) => { };

  private onTouched =
    () => { };

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(
    fn: (value: string) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(
    fn: () => void
  ): void {
    this.onTouched = fn;
  }

  setDisabledState(
    isDisabled: boolean
  ): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.value = input.value;

    this.onChange(this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}