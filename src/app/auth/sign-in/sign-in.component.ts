import { Component } from '@angular/core';
import { SignIn } from '../auth.model';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './../auth.component.css'
})
export class SignInComponent {
  email: string = ""

  signInData: SignIn = {
    email: "",
    password: ""
  };

  constructor(private supabaseService: SupabaseService) { }

  async handleSignIn(formData: NgForm) {
    if (formData.valid) {
      const { data, error } = await this.supabaseService.signIn(
        this.signInData.email, this.signInData.password
      );

      if (error) {
        alert(error.message)
      }
    }
  }
}
