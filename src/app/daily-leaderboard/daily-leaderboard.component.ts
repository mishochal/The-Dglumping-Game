import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { DailyPlayerData } from '../leaderboard/player-data.model';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-daily-leaderboard',
  imports: [LoaderComponent],
  templateUrl: './daily-leaderboard.component.html',
  styleUrl: './daily-leaderboard.component.css'
})
export class DailyLeaderboardComponent implements OnInit {
  medals = ["🥇", "🥈", "🥉"];

  dailyLeaderboard = computed(() => this.supabaseService.dailyLeaderboard());
  currentUser = computed(() => this.supabaseService.user());

  isLoading = signal<boolean>(false);
  isNewDay = signal<boolean>(false);

  supabaseService = inject(SupabaseService);

  async ngOnInit() {
    if (!this.supabaseService.isDailyLeaderboardLoaded()) {
      await this.getLeaderboard()
      this.supabaseService.getTableUpdates('current_day').subscribe((payload) => {
        this.updateLeaderboard(payload);
      });
    }
  }

  async getLeaderboard() {
    this.isLoading.set(true);
    const { data, error } = await this.supabaseService.getCurrDayLeaderboard();
    this.isLoading.set(false);

    if (error) {
      alert(error.message)
    }
    if (data?.length === 0) {
      this.isNewDay.set(true);
    } else if (data) {
      const nowDate = new Date(await this.supabaseService.getUTC());
      const lastDate = new Date(data[data.length - 1].created_at);

      if (!this.supabaseService.isSameDate(nowDate, lastDate)) {
        console.log("vas")
        this.isNewDay.set(true);
      }
    }
  }

  getMedal(position: number) {
    if (position >= this.medals.length) {
      return position + 1;
    }
    return this.medals[position]
  }

  isCurrentUser(user: string) {
    if (!this.currentUser()) {
      return false;
    }
    return this.currentUser()?.user_metadata?.["display_name"] === user;
  }

  private updateLeaderboard(payload: any) {
    const currData = this.dailyLeaderboard();
    let newData = [];

    switch (payload.eventType) {
      case 'INSERT':
        if (currData === null) {
          newData = currData;
        }
        this.isNewDay.set(false);
        newData = [...currData, payload.new];
        break;
      case 'DELETE':
        if (currData === null) {
          newData = currData;
        }
        newData = currData.filter(item => item.id !== payload.old.id);
        break;
      default:
        newData = currData;
    }

    this.supabaseService.changeDailyLeaderboardData(newData);
  }
}
