import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rules',
  imports: [],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css'
})
export class RulesComponent implements OnInit {
  isMuted = false;

  toggleSound(audio: HTMLAudioElement) {
    this.isMuted = !this.isMuted;
    localStorage.setItem("is_muted", JSON.stringify(this.isMuted))
    audio.currentTime = 0;
  }

  ngOnInit(): void {
    const isMutedLocal = localStorage.getItem("is_muted");
    if (isMutedLocal) {
      this.isMuted = JSON.parse(isMutedLocal);
    }
  }
}
