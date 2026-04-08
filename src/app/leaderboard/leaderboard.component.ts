import { Component, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { PlayerData } from './player-data.model';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {

  leaderboard = signal<PlayerData[]>([])

  constructor(private supabaseService: SupabaseService) { }

  async getLeaderboard() {
    const { data, error } = await this.supabaseService.getLeaderboard();
    if (error) {
      alert(error.message);
    } else if (data) {
      this.leaderboard.set(data);
    }
  }

  async ngOnInit() {
    this.getLeaderboard();
  }
}
