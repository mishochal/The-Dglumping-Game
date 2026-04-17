import { Component } from '@angular/core';

@Component({
  selector: 'app-rules',
  imports: [],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css'
})
export class RulesComponent {
  isMuted = false;

  toggleSound(audio: HTMLAudioElement) {
    this.isMuted = !this.isMuted;
    audio.currentTime = 0;
  }
}
