import { Component, computed, ElementRef, viewChild, signal, inject } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { RouterLink } from "@angular/router";
import { DailyPlayerData } from '../leaderboard/player-data.model';
import { DailyLeaderboardComponent } from '../daily-leaderboard/daily-leaderboard.component';
import { PositionComponent } from '../position/position.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DailyLeaderboardComponent, PositionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentUser = computed(() => this.supabaseService.user())
  position = signal<number>(-1);
  isDglumpingDisabled: boolean = false;

  dglumpAudio = viewChild.required<ElementRef<HTMLAudioElement>>("dglumpAudio");
  winnerAudio = viewChild.required<ElementRef<HTMLAudioElement>>("winnerAudio");
  loserAudio = viewChild.required<ElementRef<HTMLAudioElement>>("loserAudio");

  supabaseService = inject(SupabaseService);

  async dglump() {
    if (this.isDglumpingDisabled) {
      return
    }
    this.isDglumpingDisabled = true;

    this.dglumpAudio().nativeElement.play();
    const { data, error } = await this.supabaseService.getCurrDayLeaderboard();
    if (error) {
      alert(error.message);
    } else if (data) {
      this.position.set(await this.getPlayerPosition(data));
      if (this.position() > 0) {
        if (this.position() <= 3) {
          this.winnerAudio().nativeElement.play()
        } else {
          this.loserAudio().nativeElement.play();
        }
      }
    }

    setTimeout(() => {
      this.isDglumpingDisabled = false;
    }, 15000)
  }

  async getPlayerPosition(playersData: DailyPlayerData[]): Promise<number> {
    let position = 1;
    if (playersData.length > 0) {
      const nowUTC = await this.supabaseService.getUTC();
      const lastPositionDate = playersData[playersData.length - 1].created_at;
      const nowDate = new Date(nowUTC);
      const lastDate = new Date(lastPositionDate);

      if (this.supabaseService.isSameDate(nowDate, lastDate)) {
        position = playersData.length + 1;
      } else {
        const { data, error } = await this.supabaseService.deleteCurrDayLeaderboard();
        if (error) {
          alert(error.message)
          return -1;
        }
      }
    }

    const { data, error } = await this.supabaseService.addCurrDayLeaderboard(this.currentUser()!, position);
    if (error) {
      alert(error.message);
      return -1;
    }

    const result = await this.supabaseService.updateLeaderboard(this.currentUser()!, position);
    if (result?.error) {
      alert(result.error.message)
      return -1;
    } else if (!result) {
      alert("Could not fetch your data from the server")
      return -1;
    }

    return position;
  }

  closePositionWindow() {
    this.position.set(-1);
  }
}
