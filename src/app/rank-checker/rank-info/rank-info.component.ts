import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonThumbnail
} from '@ionic/angular/standalone';
import { Observable, map } from 'rxjs';
import { PokemonTypeColorMap } from '../../constants';
import { Pokemon } from '../../interfaces';

@Component({
  selector: 'app-rank-info',
  standalone: true,
  templateUrl: './rank-info.component.html',
  styleUrls: ['./rank-info.component.scss'],
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonThumbnail
  ],
})
export class RankInfoComponent implements OnInit {
  @Input() set pokemon(pokemon: Pokemon) {
    this._pokemon.set(pokemon);
  }
  private _pokemon: WritableSignal<Pokemon | null> = signal<Pokemon | null>(
    null
  );
  pokemon$: Observable<Pokemon | null> = toObservable(this._pokemon);
  badgeConfig$!: Observable<{ text: string; color: string }[] | null>;
  PokemonTypeColorMap = PokemonTypeColorMap;

  constructor() {}

  ngOnInit() {
    this.badgeConfig$ = this.pokemon$.pipe(
      map((pokemon) => {
        if (pokemon) {
          const badges: { text: string; color: string }[] = [];
          if (pokemon.primaryType?.type) {
            badges.push({
              text: pokemon.primaryType.names['English'],
              color: PokemonTypeColorMap.get(pokemon.primaryType.type) || '',
            });
          }
          if (pokemon.secondaryType?.type) {
            badges.push({
              text: pokemon.secondaryType.names['English'],
              color: PokemonTypeColorMap.get(pokemon.secondaryType.type) || '',
            });
          }
          return badges;
        }
        return null;
      })
    );
  }
}
