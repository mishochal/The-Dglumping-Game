import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser = computed(() => this.supabaseService.user());

  isHamburgerOpen = false;

  constructor(private supabaseService: SupabaseService) { }

  signOut() {
    this.supabaseService.signOut();
  }

  close() {
    this.isHamburgerOpen = false;
  }
}
