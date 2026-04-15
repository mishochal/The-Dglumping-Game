import { Component, computed } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { RouterLink } from "@angular/router";
import { DailyPlayerData } from '../leaderboard/player-data.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentUser = computed(() => this.supabaseService.user())

  constructor(private supabaseService: SupabaseService) { }

  async dglump() {
    const { data, error } = await this.supabaseService.getCurrDayLeaderboard();
    if (error) {
      alert(error.message);
    } else if (data) {
      const position = await this.getPlayerPosition(data);
      if (position > 0) {
        alert("your position is: " + position);
      }
    }
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
}
