import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output, Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ModifiableValue} from "../../_classes/comm/payload/modifiable-value";
import {BooleanEvent} from "../../_interfaces/events/boolean-event";
import {Event} from "@angular/router";
import {Modvaluepopup} from "../../_classes/modvaluepopup";
import {connect, debounceTime, fromEvent, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-mod-values',
  templateUrl: './mod-values.component.html',
  styleUrls: ['./mod-values.component.sass']
})
export class ModValuesComponent implements OnInit, OnChanges, AfterContentChecked{
  @Input() modValPopup: Modvaluepopup;


  @Output() ping: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('popupinfo') box: ElementRef;


  screenHeight: number;
  screenWidth: number;

  popupX: string;
  popupY: string;

  popupVisibility = 'hidden';

  constructor(private renderer: Renderer2) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  public closePopup(): void {
    this.popupVisibility = 'hidden';
    this.ping.emit();
  }

  public getCoordinates(): void {
    console.log('getCoordinates(): ','pointerX: ', this.modValPopup.pointerX, 'pointerY: ' ,this.modValPopup.pointerY);
    if (this.box != null) {
      const bheight = this.box.nativeElement.clientHeight;
      const bwidth = this.box.nativeElement.clientWidth;

      let x = this.modValPopup.pointerX;
      let y = this.modValPopup.pointerY - bheight - (this.screenHeight * 0.02);
      if (y <= 0) {
        y = this.modValPopup.pointerY + (this.screenHeight * 0.02);
      }
      if (x + bwidth >= this.screenWidth) {
        x = this.modValPopup.pointerX - bwidth;
      }

      this.popupX = x + 'px';
      this.popupY = y + 'px';
      if (x !== 0 && y !== 0) {
        this.popupVisibility = 'visible';
      }
    }


    console.log(this.popupX, this.popupY);
  }

  ngAfterContentChecked() {
    /*if (!this.modValPopup.initialized) {
      console.warn('ngAfterContentChecked', this.modValPopup);
      this.getCoordinates();
      this.modValPopup.initialized = true;
    }*/
  }


  ngOnInit(): void {
    this.modValPopup.modified = '';

  }

  @HostListener('document:mousedown', ['$event'])
  onMouseMove(e: any) {
    this.closePopup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.warn('ngOnChanges');
    console.warn(changes);
    this.getCoordinates();
  }


}
