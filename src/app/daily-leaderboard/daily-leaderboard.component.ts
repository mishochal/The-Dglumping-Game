import { Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
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
  leaderboard = computed(() => this.supabaseService.leaderboard());
  currentUser = computed(() => this.supabaseService.user());

  isDailyLoading = signal<boolean>(false);
  isNewDay = signal<boolean>(false);
  isLeaderboardLoading = signal<boolean>(false);

  isLoading = computed(() => this.isDailyLoading() || this.isLeaderboardLoading());
  userPoints: Signal<{ username: string, points: number }[]> = computed(() => this.getUserPoints())

  supabaseService = inject(SupabaseService);

  async ngOnInit() {
    this.isLeaderboardLoading.set(true);
    if (!this.supabaseService.isDailyLeaderboardLoaded()) {
      await this.getDailyLeaderboard()
      this.supabaseService.getTableUpdates('current_day').subscribe((payload) => {
        this.updateLeaderboard(payload);
      });
    }
    this.isLeaderboardLoading.set(false);

    this.isDailyLoading.set(true);
    if (!this.supabaseService.isLeaderboardLoaded()) {
      await this.getLeaderboard();
    }
    this.isDailyLoading.set(false);
  }

  async getLeaderboard() {
    const { data, error } = await this.supabaseService.getLeaderboard();
  }

  async getDailyLeaderboard() {
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

  getTime(date: string): string {
    const dglumpDate = new Date(date);
    const hours = dglumpDate.getHours() < 10 ? "0" + dglumpDate.getHours() : dglumpDate.getHours();
    const minutes = dglumpDate.getMinutes() < 10 ? "0" + dglumpDate.getMinutes() : dglumpDate.getMinutes();
    const time = `${hours}:${minutes}`;
    return time;
  }

  getUserPoints() {
    let usersData: { username: string, points: number }[] = [];

    this.leaderboard().forEach((data) => {
      const userId = data.user_id;

      usersData.push({ username: data.username, points: this.getPoints(userId) })
    })

    const dailyLeaderboard = this.dailyLeaderboard();
    console.log(dailyLeaderboard)

    return usersData.sort((a, b) => b.points - a.points);
  }

  getPoints(userId: string): number {
    if (this.isNewDay()) {
      return 0;
    }

    let points = 0;
    this.dailyLeaderboard().forEach((userData) => {
      if (userData.user_id === userId) {
        points += this.calcPoints(userData.position);
      }
    })


    return points
  }

  private calcPoints(position: number): number {
    switch (position) {
      case 1:
        return 5;
      case 2:
        return 3;
      case 3:
        return 1;
      default:
        return 0;
    }
  }
}
