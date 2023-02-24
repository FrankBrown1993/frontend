import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.sass']
})
export class OrientationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
/*
// mobile
@media (max-width: 480px), (max-height: 480px)

// mobile portrait
@media (max-width: 480px)

// mobile landscape
@media (max-height: 480px)

// tablet
@media (max-width: 1024px) and (max-height: 1024px) and (min-width: 481px) and (min-height: 481px)

// tablet portrait
@media (min-width: 481px) and (max-width: 768px) and (min-height: 481px)

// tablet landscape
@media (min-width: 769px) and (max-width: 1024px) and (min-height: 481px)

// other
@media (min-width: 1025px)

*/
