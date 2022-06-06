import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menuSelected = 'recipe';
  title = 'udemy-course-project';

  onMenuSelected(feature: string) {
    this.menuSelected = feature;
  }
}
