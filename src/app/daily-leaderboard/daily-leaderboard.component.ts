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

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit(): void {
    this.getLeaderboard()
  }

  async getLeaderboard() {
    const { data, error } = await this.supabaseService.getCurrDayLeaderboard();

    if (error) {
      alert(error.message)
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
}
