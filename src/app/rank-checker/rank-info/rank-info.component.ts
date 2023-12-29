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
import { Observable, map } from 'rxjs';
import { PokemonTypeColorMap } from '../../constants';
import { Pokemon } from '../../interfaces';
import { FormControl, FormGroup } from '@angular/forms';

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

  constructor() {
    this.ivsFormGroup.valueChanges.subscribe(console.log);
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
