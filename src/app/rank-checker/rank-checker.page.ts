import { Component, WritableSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonThumbnail,
  IonLabel,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { Observable, debounceTime, switchMap } from 'rxjs';
import { Pokemon } from '../interfaces';
import { RankService } from './rank.service';
import { CommonModule } from '@angular/common';
import { RankInfoComponent } from './rank-info/rank-info.component';

@Component({
  selector: 'app-rank-checker',
  templateUrl: 'rank-checker.page.html',
  styleUrls: ['rank-checker.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonThumbnail,
    IonLabel,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    FormsModule,
    ReactiveFormsModule,
    RankInfoComponent,
  ],
})
export class RankCheckerPage {
  searchTerm = '';
  private searchControl: FormControl<string | null> = new FormControl<
    string | null
  >('');
  results$!: Observable<Pokemon[]>;
  selectedPokemon: WritableSignal<Pokemon | null> = signal(null);
  showResults: WritableSignal<boolean> = signal(true);

  constructor(private rankService: RankService) {
    this.results$ = this.searchControl.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(200),
      switchMap((value) => this.rankService.searchPokemon(value || ''))
    );
  }

  handleSearchTermChange(value: string): void {
    this.searchControl.setValue(value);
    this.showResults.set(true);
    this.selectedPokemon.set(null);
  }

  handlePokemonSelected(pokemon: Pokemon): void {
    this.selectedPokemon.set(pokemon);
    this.searchTerm = pokemon.names['English'];
    this.showResults.set(false);
  }
}
