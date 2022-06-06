import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  @Output() featureSelected: EventEmitter<string> = new EventEmitter<string>();
  
  ngOnInit(): void {

  }
  
  onMenuSelected(feature: string) {
    this.featureSelected.emit(feature);
  }

}
