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
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { Observable, map } from 'rxjs';
import { PokemonRankInfoForEvolutions, Ranks } from 'src/app/interfaces';

interface CardInfo {
  pokemon: string;
  greatLeague: LeagueRankInfo;
  ultraLeague: LeagueRankInfo;
}

interface LeagueRankInfo {
  rank: number;
  cp: number;
  level: number;
}

@Component({
  selector: 'app-by-rank-cards',
  standalone: true,
  templateUrl: './by-rank-cards.component.html',
  styleUrls: ['./by-rank-cards.component.scss'],
  imports: [CommonModule, IonCard, IonCardTitle, IonCardContent, IonCardHeader],
})
export class ByRankCardsComponent implements OnInit {
  @Input() set rankInfo(rankInfo: PokemonRankInfoForEvolutions) {
    this._rankInfo.set(rankInfo);
  }
  private _rankInfo: WritableSignal<PokemonRankInfoForEvolutions | null> =
    signal(null);
  rankInfo$: Observable<PokemonRankInfoForEvolutions | null> = toObservable(
    this._rankInfo
  );
  cardInfo$!: Observable<CardInfo[]>;

  constructor() {}

  ngOnInit() {
    this.cardInfo$ = this.rankInfo$.pipe(
      map((rankInfo) => {
        if (!rankInfo) {
          return [];
        }
        return rankInfo.evolutions.map((evolution) => {
          const ranks: Ranks = rankInfo.rankForEvolutions[evolution];
          const pokemonName: string =
            evolution.charAt(0).toUpperCase() +
            evolution.slice(1).toLowerCase();
          return {
            pokemon: pokemonName,
            greatLeague: {
              rank: ranks.greatLeagueRank.ranks.all,
              cp: ranks.greatLeagueRank.cp,
              level: ranks.greatLeagueRank.level,
            },
            ultraLeague: {
              rank: ranks.ultraLeagueRank.ranks.all,
              cp: ranks.ultraLeagueRank.cp,
              level: ranks.ultraLeagueRank.level,
            },
          };
        });
      })
    );
  }

  copyRankString(rank: number, league: 'g' | 'u'): void {
    // Format will be ".<g|u><rank> <ivs>"
    const ivs =
      Object.values(this._rankInfo()?.rankForEvolutions || {})?.[0]
        ?.greatLeagueRank.ivs || '';
    const ivString = `.${league}${rank} ${ivs}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(ivString)
        .then(() => {
          console.log('SUCCESS!');
        })
        .catch(() => {
          console.log('Error!');
        });
    } else {
      this.copyToClipboardFallback(ivString);
    }
  }

  copyToClipboardFallback(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      console.log('SUCCESS!');
    } catch {
      console.log('Error!');
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
