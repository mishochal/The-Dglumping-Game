import { Component, computed, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { DailyPlayerData } from '../leaderboard/player-data.model';

@Component({
  selector: 'app-daily-leaderboard',
  imports: [],
  templateUrl: './daily-leaderboard.component.html',
  styleUrl: './daily-leaderboard.component.css'
})
export class DailyLeaderboardComponent implements OnInit {
  medals = ["🥇", "🥈", "🥉"];

  dailyLeaderboard = signal<DailyPlayerData[] | null>([]);
  currentUser = computed(() => this.supabaseService.user());

  isLoading = false;
  isNewDay = signal<boolean>(false);

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    this.isLoading = true;
    await this.getLeaderboard()
    this.isLoading = false;
    this.supabaseService.getTableUpdates('current_day').subscribe((payload) => {
      this.updateLeaderboard(payload);
    });
  }

  async getLeaderboard() {
    const { data, error } = await this.supabaseService.getCurrDayLeaderboard();

    if (error) {
      alert(error.message)
    }
    if (data?.length === 0) {
      this.isNewDay.set(true);
    } else if (data) {
      const nowDate = new Date(await this.supabaseService.getUTC());
      const lastDate = new Date(data[data.length - 1].created_at);

      if (!this.supabaseService.isSameDate(nowDate, lastDate)) {
        this.isNewDay.set(true);
      }
    }
    this.dailyLeaderboard.set(data);
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
    this.dailyLeaderboard.update((current) => {
      switch (payload.eventType) {
        case 'INSERT':
          console.log("auf")
          if (current === null) {
            return current;
          }
          this.isNewDay.set(false);
          return [...current, payload.new];
        case 'DELETE':
          if (current === null) {
            return current;
          }
          return current.filter(item => item.id !== payload.old.id);
        default:
          return current;
      }
    });
  }
}
