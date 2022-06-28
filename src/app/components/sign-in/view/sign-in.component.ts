import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  public form!: FormGroup;

  public loading$: Observable<boolean>;

  public passwordVisible = false;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private toastr: ToastrService) {
    this.loading$ = _auth.loading$;
    this._initForm();
  }

  get email() {
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  public onSubmit() {
    if (this.form.valid) {
      this._auth.signIn(this.form.value.email, this.form.value.password)
    } else {
      this.form.markAllAsTouched();
      this.toastr.error('Error: Correct the invalid field entries.')
    }
  }

  private _initForm() {
    this.form = this._fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void { }
}
