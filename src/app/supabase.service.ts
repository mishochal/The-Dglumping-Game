import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  private currentUser = signal<User | null>(null)
  user = this.currentUser.asReadonly();

  constructor() {
    this.supabase = createClient(
      "https://yktfevkztnqsppdajbbe.supabase.co",
      "sb_publishable_8CjkR5rjKbrFKOK8Oich9Q_9CjR1hJ6"
    )

    // Initial check
    this.supabase.auth.getUser().then(({ data }) => {
      this.currentUser.set(data.user);
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });

    console.log(this.currentUser())
  }

  async getLeaderboard() {
    const { data, error } = await this.supabase.
      from("leaderboard").
      select("*").
      order("points", { ascending: false }).
      limit(10);

    return { data, error };
  }

  async insertLeaderboardRow(userId: string, username: string) {
    return await this.supabase.
      from("leaderboard").
      insert([
        {
          user_id: userId,
          username: username
        }
      ]);
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

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
  }

  async signOut() {
    await this.supabase.auth.signOut();
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
