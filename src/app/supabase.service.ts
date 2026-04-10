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

  async signUp(email: string, password: string, username: string) {
    return await this.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: username
        }
      }
    });
  }

  getTableUpdates(tableName: string): Observable<any> {
    return new Observable((observer) => {
      const channel = this.supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload) => {
            observer.next(payload); // Push the change to the app
          }
        )
        .subscribe();

      // Cleanup when the component is destroyed
      return () => {
        this.supabase.removeChannel(channel);
      };
    });
  }
}
