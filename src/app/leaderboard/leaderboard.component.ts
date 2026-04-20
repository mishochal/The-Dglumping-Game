import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { PlayerData } from './player-data.model';
import { LoaderComponent } from '../loader/loader.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  imports: [LoaderComponent, RouterLink],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {

  leaderboard = computed(() => this.supabaseService.leaderboard());

  isLoading = signal<boolean>(false);

  supabaseService = inject(SupabaseService);

  async getLeaderboard() {
    this.isLoading.set(true)
    const { data, error } = await this.supabaseService.getLeaderboard();
    if (error) {
      alert(error.message);
    }
    this.isLoading.set(false);
  }

  async ngOnInit() {
    if (!this.supabaseService.isLeaderboardLoaded()) {
      this.getLeaderboard();
      this.supabaseService.getTableUpdates('leaderboard').subscribe((payload) => {
        this.updateLeaderboardSignal(payload);
      });
    }
  }

  private updateLeaderboardSignal(payload: any) {
    let currData = this.leaderboard();
    let newData = [];

    switch (payload.eventType) {
      case 'INSERT':
        newData = [...currData, payload.new];
        break;
      case 'UPDATE':
        newData = currData.map(item => item.id === payload.new.id ? payload.new : item).sort((a, b) => b.points - a.points);
        break;
      case 'DELETE':
        newData = currData.filter(item => item.id !== payload.old.id);
        break;
      default:
        newData = currData;
    }

    this.supabaseService.changeLeaderboardData(newData);
  }
}

