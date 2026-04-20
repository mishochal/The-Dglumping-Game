import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-position',
  imports: [],
  templateUrl: './position.component.html',
  styleUrl: './position.component.css'
})
export class PositionComponent {
  position = input.required<number>();
  closeWindow = output<void>();

  getPositionDetails() {
    switch (this.position()) {
      case 1:
        return { pos: "first", medal: "🥇" }
      case 2:
        return { pos: "second", medal: "🥈" }
      case 3:
        return { pos: "third", medal: "🥉" }
      default:
        return { pos: this.position() + "th", medal: "" }
    }
  }

  close() {
    this.closeWindow.emit()
  }
}
