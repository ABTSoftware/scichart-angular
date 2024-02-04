import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScichartAngularComponent } from 'scichart-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScichartAngularComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'scichart-angular-app';
}
