import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UpdateUserDTO, User, UserDTO } from '../data/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../app.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = new User(
    0,
    '',
    '',
    '',
    '',
    '',
  );
  error: boolean = false;
  success: boolean = false;

  constructor(private readonly http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<UserDTO>('/api/user').subscribe({
      next: (value: UserDTO) => {
        this.user.id = value.id;
        this.user.email = value.email;
        this.user.firstName = value.firstName;
        this.user.lastName = value.lastName;
      },
    });
  }

  updateUser(): void {
    if (this.user.isUpdateValid()) {
      const updateUser: UpdateUserDTO = {
        id: this.user.id,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        password: this.user.password,
      };
      this.http.put<UserDTO>('/api/user', updateUser).subscribe({
        next: (value: UserDTO) => {
          this.user.id = value.id;
          this.user.email = value.email;
          this.user.firstName = value.firstName;
          this.user.lastName = value.lastName;
          this.user.password = '';
          this.user.passwordRepeat = '';
          this.success = true;
          this.error = false;
        },
        error: () => {
          this.error = true;
          this.success = false;
        }
      });
    } else {
      this.error = true;
      this.success = false;
    }
  }

  resetState(): void {
    console.log("called")
    this.error = false;
    this.success = false;
  }

  getSuccessMessage(): string {
    return "Profil geupdated";
  }

  getErrorMessage(): string {
    if (!this.user.isFirstNameValid()) {
      return "Gültigen Vornamen eingeben";
    } else if (!this.user.isLastNameValid()) {
      return "Gültigen Nachnamen eingeben";
    } else if (!this.user.isEmailValid()) {
      return "Gültige E-Mail Adresse eingeben";
    } else if (
      (this.user.password || this.user.passwordRepeat)
      && !this.user.isPasswordValid()
    ) {
      return "Gültiges Passwort eingeben";
    } else {
      return "Fehler beim Update des Accounts";
    }
  }

}
