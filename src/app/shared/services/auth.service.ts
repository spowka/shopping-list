import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User, UserInfo } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, skip, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading$.asObservable();

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    private toastr: ToastrService
  ) { }

  signIn(email: string, password: string) {
    this._loading$.next(true);
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user).then(() => {
          this._loading$.next(false);
          this.router.navigate(['shopping-list']);
        });
      })
      .catch((error) => {
        this.toastr.error(error.message)
      }).finally(() => {
        this._loading$.next(false);
      });
  }

  signUp(userInfo: UserInfo) {
    this._loading$.next(true);
    return this.afAuth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((result) => {
        return this.setUserData(result.user, userInfo).then(() => {
          this._loading$.next(false);
          return result
        });
      })
      .catch((error) => {
        this.toastr.error(error.message)
        this._loading$.next(false);
      });
  }

  setUserData(user: any, userInfo?: UserInfo) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    let userData: User | {} = {}

    if (userInfo) {
      userData = {
        uid: user.uid,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        fullName: userInfo.firstName + ' ' + userInfo.lastName,
        email: user.email,
      };

      this.setUserToStorage(userData)
    } else {
      userRef.valueChanges().pipe(skip(2), take(1)).subscribe(userInfo => {
        userData = {
          uid: userInfo.uid,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          fullName: userInfo.firstName + ' ' + userInfo.lastName,
          email: userInfo.email,
        };

        this.setUserToStorage(userData)
      })
    }

    return userRef.set(userData, {
      merge: true,
    });
  }

  setUserToStorage(userData: User| {}) {
    localStorage.setItem('user', JSON.stringify(userData));
    this.router.navigate(['shopping-list']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }

  get uid(): string {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user?.uid;
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
