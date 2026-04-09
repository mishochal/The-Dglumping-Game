import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { SignUp } from '../auth.model';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule],
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

  handleSignUp(formData: NgForm) {
    console.log(formData);
  }
}
