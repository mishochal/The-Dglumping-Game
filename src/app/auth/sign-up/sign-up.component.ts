import { Component, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { SignUp } from '../auth.model';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfirmPasswordDirective } from "./confirm-password.directive";
import { SupabaseService } from '../../supabase.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule, ConfirmPasswordDirective, LoaderComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './../auth.component.css'
})
export class SignUpComponent {
  isLoading = signal<boolean>(false);

  signUpData: SignUp = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  async handleSignUp(formData: NgForm) {
    if (formData.valid) {
      this.isLoading.set(true);
      const { data, error } = await this.supabaseService.signUp(
        this.signUpData.email,
        this.signUpData.password,
        this.signUpData.username
      );
      this.isLoading.set(false);

      if (error) {
        alert(error.message);
      } else if (data.user) {
        const { error } = await this.supabaseService.insertLeaderboardRow(
          data.user.id,
          this.signUpData.username
        )
        if (error) {
          alert(error.message)
        } else {
          this.router.navigate(["/home"])
        }
      }
    }
  }
}
