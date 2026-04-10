import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser = computed(() => this.supabaseService.user());

  constructor(private supabaseService: SupabaseService) { }

  signOut() {
    this.supabaseService.signOut();
  }
}
