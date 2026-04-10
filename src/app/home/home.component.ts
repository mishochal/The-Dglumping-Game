import { Component, computed } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentUser = computed(() => this.supabaseService.user())

  constructor(private supabaseService: SupabaseService) { }
}
