import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-rank-info',
  standalone: true,
  templateUrl: './rank-info.component.html',
  styleUrls: ['./rank-info.component.scss'],
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class RankInfoComponent implements OnInit {
  @Input() set pokemonId(pokemonId: string) {
    this._pokemonId.set(pokemonId);
  }
  _pokemonId: WritableSignal<string> = signal<string>('');

  constructor() {}

  ngOnInit() {}
}
