import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HeldenbogenComponent } from './heldenbogen/heldenbogen.component';
import { TitelbereichComponent } from './heldenbogen/titelbereich/titelbereich.component';
import { AllgemeinComponent } from './heldenbogen/inhalt/allgemein/allgemein.component';
import { AusruestungComponent } from './heldenbogen/inhalt/ausruestung/ausruestung.component';
import { KampfComponent } from './heldenbogen/inhalt/kampf/kampf.component';
import { TalenteComponent } from './heldenbogen/inhalt/talente/talente.component';
import { MenuComponent } from './menu/menu.component';
import { OrientationComponent } from './tests/orientation/orientation.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeldenbogenComponent,
    TitelbereichComponent,
    AllgemeinComponent,
    AusruestungComponent,
    KampfComponent,
    TalenteComponent,
    MenuComponent,
    OrientationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
