import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavigationEnd, Router, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  showHeader = true

  private unsubscribe$ = new Subscription()

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.unsubscribe$.add(
      this.router.events.subscribe((event: NavigationEvent) => {
        if (event instanceof NavigationEnd) {
          this.showHeader = event.url.includes('shopping-list')
        }
      })
    )
  }

  public logout() {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
