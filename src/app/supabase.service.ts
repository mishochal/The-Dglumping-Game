import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { DailyPlayerData, PlayerData } from './leaderboard/player-data.model';

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

  async updateLeaderboard(user: User, position: number) {
    const newPlayerData = await this.getNewPlayerData(user, position);

    if (newPlayerData) {
      const { data, error } = await this.supabase.
        from("leaderboard").
        update(newPlayerData).
        eq("user_id", user.id);

      return { data, error };
    }
    return null
  }

  async getCurrDayLeaderboard() {
    const { data, error } = await this.supabase.
      from("current_day").
      select("*").
      order("position", { ascending: true }) as { data: DailyPlayerData[] | null, error: any };
    return { data, error };
  }

  async addCurrDayLeaderboard(user: User, position: number) {
    const { data, error } = await this.supabase.
      from("current_day").
      insert([
        {
          user_id: user.id,
          username: user.user_metadata?.["display_name"],
          position: position
        }
      ]);
    return { data, error }
  }

  async deleteCurrDayLeaderboard() {
    const { data, error } = await this.supabase.
      from("current_day").
      delete().
      neq("user_id", "000990099009900909009909090900-9ds-90-0asd-90-sad--sa-");
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
      const uniqueChannelName = `${tableName}-${Math.random().toString(36).substring(2, 9)}`;

      const channel = this.supabase
        .channel(uniqueChannelName)
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

  async getUTC() {
    const data = await this.supabase.rpc('get_utc_now');
    return data.data;
  }

  isSameDate(currDate: Date, lastDate: Date): boolean {
    // const resetBase = 4;
    // const timeZoneOffset = new Date().getTimezoneOffset() / 60;
    // const resetTime = resetBase - timeZoneOffset;

    const resetTime = 8;

    const diff = currDate.getTime() - lastDate.getTime();

    if (diff / (1000 * 60 * 60 * 24) > 1) {
      return false;
    } else if (currDate.getDate() !== lastDate.getDate() && currDate.getHours() > resetTime) {
      return false
    } else if (lastDate.getHours() < resetTime && currDate.getHours() > resetTime) {
      return false;
    }
    return true;
  }

  private getPoints(position: number): number {
    let points = 0;

    switch (position) {
      case 1:
        points = 5;
        break;
      case 2:
        points = 3;
        break;
      case 3:
        points = 1;
        break;
      default:
        points = 0;
    }

    return points;
  }

  private async getNewPlayerData(user: User, position: number) {
    const { data } = await this.supabase.
      from("leaderboard").
      select("*").
      eq("user_id", user.id).
      single() as { data: PlayerData | null };

    if (data) {
      const pointsToGet = this.getPoints(position);

      const newData: PlayerData = { ...data };
      newData.points = data.points + pointsToGet;
      newData.total_dglumps = data.total_dglumps + 1;

      switch (position) {
        case 1:
          newData.first = data.first + 1;
          break;
        case 2:
          newData.second = data.second + 1;
          break;
        case 3:
          newData.third = data.third + 1;
          break;
        default:
          break;
      }

      return newData;
    } else {
      return null;
    }
  }
}
