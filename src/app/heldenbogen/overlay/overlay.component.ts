import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.sass']
})
export class OverlayComponent implements OnChanges, AfterViewInit{

  @Input() activeOverlay: string;
  @Output() activeOverlayChange = new EventEmitter<string>();

  public boxShadow = '';
  private pxArray: number[] = [];

  ngAfterViewInit(): void {
    const element = document.getElementById('modInfo');
    const style = getComputedStyle(element!)!.boxShadow;
    console.info(style);
    const array: string[] = style.split(')')[1].trim().split(' ');
    this.pxArray = [];
    const clientWidth = window.innerWidth;
    array.forEach(px => {
      px = px.substring(0, px.length-2);
      this.pxArray.push(Number(px) / clientWidth);
    });
    console.info(this.pxArray);
    console.info(this.combineBoxShadow());

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeOverlay'].currentValue === '') {
      console.info('overlay onChanges:', changes);
    }
  }

  private deactivateAllOverlays() {
  }

  public modInfo() {
    this.activate('modInfo');
    console.info(document.getElementById('modInfo'));
  }

  public deativate(name: string) {
    this.activeOverlay = '';
    this.activeOverlayChange.emit(this.activeOverlay);
  }

  private activate(name: string): void {
    this.activeOverlay = name;
    this.activeOverlayChange.emit(this.activeOverlay);
  }

  private combineBoxShadow(): string {
    // rgb(136, 136, 136) 5.12px 7.68px 10.24px 0px
    let shadow = 'rgb(136, 136, 136)';
    this.pxArray.forEach(px => {
      shadow += ' ' + px * window.innerWidth + 'px';
    });
    return shadow;
  }
}
