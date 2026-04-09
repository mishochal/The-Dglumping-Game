import { Component } from '@angular/core';
import { SignIn } from '../auth.model';
import { FormsModule, NgForm } from '@angular/forms';

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

  handleSignIn(formData: NgForm) {
    if (formData.valid) {
      console.log(formData)
    }
  }
}
