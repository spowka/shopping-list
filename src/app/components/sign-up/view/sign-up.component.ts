import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public form!: FormGroup;

  public loading$: Observable<boolean>;

  public passwordVisible = false;
  public completeProfileVisible = false;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private toastr: ToastrService,
    private router: Router) {
    this.loading$ = _auth.loading$;
    this._initForm();
  }

  get email() {
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  get firstName() {
    return this.form.get('firstName')
  }

  get lastName() {
    return this.form.get('lastName')
  }

  get username() {
    return this.form.get('username')
  }

  ngOnInit(): void { }

  public onSubmit() {
    if (this.form.valid) {
      this._initAdditionalControls();
      this.completeProfileVisible = true;
    } else {
      this.form.markAllAsTouched();
      this.toastr.error('Error: Correct the invalid field entries.')
    }
  }

  public onCompleteProfile() {
    if (this.form.valid) {
      this._auth.signUp(this.form.value)
    } else {
      this.form.markAllAsTouched();
      this.toastr.error('Error: Correct the invalid field entries.')
    }
  }

  private _initForm() {
    this.form = this._fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }


  private _initAdditionalControls() {
    this.form = this._fb.group({
      ...this.form.controls,
      firstName: [null, [Validators.required, Validators.maxLength(20)]],
      lastName: [null, [Validators.required, Validators.maxLength(20)]],
      username: [null, [Validators.required, Validators.maxLength(15)]]
    })
  }

}
