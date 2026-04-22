import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  text = input.required<string>();
  response = output<boolean>();

  confirm() {
    this.response.emit(true);
  }

  reject() {
    this.response.emit(false);
  }
}
