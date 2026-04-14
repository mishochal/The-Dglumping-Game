export interface PlayerData {
  id: number;
  user_id: string;
  username: string;
  first: number;
  second: number;
  third: number;
  total_dglumps: number;
  points: number;
}

export interface DailyPlayerData {
  id: number;
  created_at: string;
  user_id: string;
  username: string;
  position: number;
}