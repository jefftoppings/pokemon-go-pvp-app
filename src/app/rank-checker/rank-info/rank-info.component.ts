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
  IonThumbnail,
  IonInput,
} from '@ionic/angular/standalone';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { PokemonTypeColorMap } from '../../constants';
import { Pokemon, PokemonRankInfoForEvolutions } from '../../interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { RankService } from '../rank.service';

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
    IonThumbnail,
    IonInput,
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
  ivsFormGroup: FormGroup = new FormGroup({
    attack: new FormControl<number | null>(null),
    defense: new FormControl<number | null>(null),
    stamina: new FormControl<number | null>(null),
  });
  rankInfoForEvolutions$!: Observable<PokemonRankInfoForEvolutions | null>;

  constructor(private rankService: RankService) {
    this.rankInfoForEvolutions$ = this.ivsFormGroup.valueChanges.pipe(
      switchMap((ivs) => {
        if (
          Object.values(ivs).every(
            (value) => value !== undefined && value !== null
          )
        ) {
          return this.rankService.getRankInfoForEvolutions(
            this._pokemon()?.id || '',
            {
              atk: ivs.attack,
              def: ivs.defense,
              hp: ivs.stamina,
            }
          );
        }
        return of(null);
      }),
      catchError(() => of(null))
    );
  }

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

  handleAttackChange(value: string) {
    const attack: number | null = value ? parseInt(value, 10) : null;
    this.ivsFormGroup.get('attack')?.setValue(attack);
  }

  handleDefenseChange(value: string) {
    const defense: number | null = value ? parseInt(value, 10) : null;
    this.ivsFormGroup.get('defense')?.setValue(defense);
  }

  handleStaminaChange(value: string) {
    const stamina: number | null = value ? parseInt(value, 10) : null;
    this.ivsFormGroup.get('stamina')?.setValue(stamina);
  }
}
