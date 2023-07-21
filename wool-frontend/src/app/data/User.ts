export class User {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public password: string,
    public passwordRepeat: string,
  ) { }

  isUpdateValid(): boolean {
    return this.isIdValid()
      && this.isFirstNameValid()
      && this.isLastNameValid()
      && this.isEmailValid()
      && (!this.password || this.isPasswordValid());
  }

  isCreateValid(): boolean {
    return this.isFirstNameValid()
      && this.isLastNameValid()
      && this.isEmailValid()
      && this.isPasswordValid();
  }

  isIdValid(): boolean {
    return !!this.id;
  }

  isFirstNameValid(): boolean {
    return this.firstName.length > 2;
  }

  isLastNameValid(): boolean {
    return this.lastName.length > 2;
  }

  isEmailValid(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }

  isPasswordValid(): boolean {
    return this.password.length > 8 && this.password === this.passwordRepeat;
  }

}

export class UserDTO {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
  ) { }
}

export class UpdateUserDTO {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public password: string,
  ) { }
}