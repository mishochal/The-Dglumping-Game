import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      "https://yktfevkztnqsppdajbbe.supabase.co",
      "sb_publishable_8CjkR5rjKbrFKOK8Oich9Q_9CjR1hJ6"
    )
  }

  async getLeaderboard() {
    const { data, error } = await this.supabase.
      from("leaderboard").
      select("*").
      order("points", { ascending: false }).
      limit(10);

    return { data, error };
  }
}
