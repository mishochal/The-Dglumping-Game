import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { SignUp } from '../auth.model';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfirmPasswordDirective } from "./confirm-password.directive";
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule, ConfirmPasswordDirective],
  templateUrl: './sign-up.component.html',
  styleUrl: './../auth.component.css'
})
export class SignUpComponent {

  signUpData: SignUp = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  constructor(private supabaseService: SupabaseService) { }

  async handleSignUp(formData: NgForm) {
    if (formData.valid) {
      const { data, error } = await this.supabaseService.signUp(
        this.signUpData.email,
        this.signUpData.password,
        this.signUpData.username
      );

      if (error) {
        alert(error.message);
      } else if (data) {
        console.log(data)
      }
    }
  }
}
