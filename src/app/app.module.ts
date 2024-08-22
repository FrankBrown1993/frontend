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
import { ImagerotationComponent } from './tests/imagerotation/imagerotation.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ConnectionComponent } from './tests/connection/connection.component';
import { ModValuesComponent } from './heldenbogen/mod-values/mod-values.component';
import { OverlayComponent } from './heldenbogen/overlay/overlay.component';
import { PortraitComponent } from './heldenbogen/subcomponents/portrait/portrait.component';
import { ArenaComponent } from './gm/arena/arena.component';
import { HeldenerschaffungComponent } from './heldenerschaffung/heldenerschaffung.component';
import { ErfahrungComponent } from './heldenerschaffung/erfahrung/erfahrung.component';
import { SpeziesComponent } from './heldenerschaffung/spezies/spezies.component';
import { KulturComponent } from './heldenerschaffung/kultur/kultur.component';
import { AussehenComponent } from './heldenerschaffung/aussehen/aussehen.component';
import { ProfessionComponent } from './heldenerschaffung/profession/profession.component';
import { WerteComponent } from './heldenerschaffung/werte/werte.component';

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
    OrientationComponent,
    ImagerotationComponent,
    ConnectionComponent,
    ModValuesComponent,
    OverlayComponent,
    PortraitComponent,
    ArenaComponent,
    HeldenerschaffungComponent,
    ErfahrungComponent,
    SpeziesComponent,
    KulturComponent,
    AussehenComponent,
    ProfessionComponent,
    WerteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
