import { Component, signal } from '@angular/core';
import { SignIn } from '../auth.model';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, RouterLink, LoaderComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './../auth.component.css'
})
export class SignInComponent {
  isLoading = signal<boolean>(false);

  signInData: SignIn = {
    email: "",
    password: ""
  };

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  async handleSignIn(formData: NgForm) {
    if (formData.valid) {
      this.isLoading.set(true);
      const { data, error } = await this.supabaseService.signIn(
        this.signInData.email, this.signInData.password
      );
      this.isLoading.set(false);

      if (error) {
        alert(error.message)
      } else if (data) {
        this.router.navigate(["/home"])
      }
    }
  }
}
