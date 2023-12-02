import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.sass']
})
export class OverlayComponent {
  @Input() activeOverlay: string;
  @Output() activeOverlayChange = new EventEmitter<string>();

  public activate(name: string): void {
    this.activeOverlay = name;
    alert('active overlay: ' + this.activeOverlay);
    this.activeOverlayChange.emit(this.activeOverlay);
  }

  public check() {
    alert('active overlay: ' + this.activeOverlay);
  }
}
