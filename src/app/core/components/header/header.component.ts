import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

enum UserGreetings {
  English = 'Hello, ',
  Romanian = 'Bună, ',
  German = 'Hallo, ',
  Spanish = 'Hola, ',
  France = 'Bonjour, '
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input({required: true}) userName: string = '';
  @Input({required: true}) userImg: string = '';
  navList = ["Home", "TV Shows", "News & Popular", "My List", "Browse by Language"];
  greetingMessages: string[] = Object.values(UserGreetings);

  private _greeting: string | null = null;

  get greeting(): string {
    if (!this._greeting) {
      this._greeting = this.getRandomGreeting();
    }
    return this._greeting;
  }

  private getRandomGreeting(): string {
    const randomIndex = Math.floor(Math.random() * this.greetingMessages.length);
    return this.greetingMessages[randomIndex];
  }
}
