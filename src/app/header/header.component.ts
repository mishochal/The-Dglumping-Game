import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser = computed(() => this.supabaseService.user());

  isHamburgerOpen = false;

  supabaseService = inject(SupabaseService);

  signOut() {
    this.supabaseService.signOut();
  }

  close() {
    this.isHamburgerOpen = false;
  }
}
