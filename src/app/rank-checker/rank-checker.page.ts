import { Component, WritableSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonThumbnail,
  IonLabel,
  IonList,
  IonItem,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import {
  Observable,
  catchError,
  debounceTime,
  finalize,
  firstValueFrom,
  from,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
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
    IonThumbnail,
    IonLabel,
    IonList,
    IonItem,
    IonProgressBar,
    FormsModule,
    ReactiveFormsModule,
    RankInfoComponent,
  ],
})
export class RankCheckerPage {
  searchTerm = this.rankService.getSearchTermCache();
  private searchControl: FormControl<string | null> = new FormControl<
    string | null
  >('');
  results$!: Observable<Pokemon[]>;
  selectedPokemon: WritableSignal<Pokemon | null> = signal(null);
  showResults: WritableSignal<boolean> = signal(true);
  loading: WritableSignal<boolean> = signal(false);

  constructor(
    private rankService: RankService,
    private toastController: ToastController
  ) {
    const cachedSearchTerm = this.rankService.getSearchTermCache();
    this.results$ = this.searchControl.valueChanges.pipe(
      startWith(cachedSearchTerm),
      takeUntilDestroyed(),
      debounceTime(200),
      tap(() => this.loading.set(true)),
      switchMap((value) => this.rankService.searchPokemon(value || '')),
      catchError((error) => {
        return from(this.showErrorMessage(error)).pipe(map(() => []));
      }),
      tap(() => this.loading.set(false)),
      finalize(() => this.loading.set(false))
    );

    if (cachedSearchTerm) {
      this.selectFirstSearchTerm();
    }
  }

  async selectFirstSearchTerm(): Promise<void> {
    await firstValueFrom(this.results$).then((results) => {
      if (results[0]) {
        this.handlePokemonSelected(results[0]);
      }
    });
  }

  handleSearchTermChange(value: string): void {
    this.searchControl.setValue(value);
    if (value) {
      this.rankService.setSearchTermCache(value);
    } else {
      this.rankService.clearRankServiceCache();
    }
    this.showResults.set(true);
    this.selectedPokemon.set(null);
  }

  handlePokemonSelected(pokemon: Pokemon): void {
    this.selectedPokemon.set(pokemon);
    this.rankService.setSearchTermCache(pokemon.names?.['English'] || '');
    this.searchTerm = pokemon.names['English'];
    this.showResults.set(false);
  }

  async showErrorMessage(error?: string): Promise<void> {
    const toast = await this.toastController.create({
      message:
        'There was an error loading results' + (error ? ': ' + error : ''),
      duration: 3000,
    });
    return toast.present();
  }
}
