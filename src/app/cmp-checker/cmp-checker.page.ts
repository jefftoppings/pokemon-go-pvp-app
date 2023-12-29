import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-cmp-checker',
  templateUrl: 'cmp-checker.page.html',
  styleUrls: ['cmp-checker.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class CMPCheckerPage {
  constructor() {}
}
