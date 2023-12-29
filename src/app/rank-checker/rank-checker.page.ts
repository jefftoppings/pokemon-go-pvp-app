import { Component } from '@angular/core';
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
  IonList,IonItem
} from '@ionic/angular/standalone';
import { Observable, debounceTime, startWith, switchMap } from 'rxjs';
import { Pokemon } from '../interfaces';
import { RankService } from './rank.service';
import { CommonModule } from '@angular/common';

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
    IonList,IonItem,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RankCheckerPage {
  searchTerm = '';
  private searchControl: FormControl<string | null> = new FormControl<
    string | null
  >('');
  results$!: Observable<Pokemon[]>;

  constructor(private rankService: RankService) {
    this.results$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      takeUntilDestroyed(),
      debounceTime(200),
      switchMap((value) => this.rankService.searchPokemon(value || ''))
    );
  }

  handleSearchTermChange(value: string): void {
    this.searchControl.setValue(value);
  }
}
