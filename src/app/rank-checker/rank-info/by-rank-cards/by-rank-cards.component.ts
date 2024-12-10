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
  IonCardContent,
  ToastController,
  IonIcon,
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
  imports: [IonIcon, CommonModule, IonCard, IonCardContent],
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

  constructor(private toastController: ToastController) {}

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

  async copyRankString(rank: number, league: 'g' | 'u'): Promise<void> {
    // Format will be ".<g|u><rank> <ivs>"
    const ivs =
      Object.values(this._rankInfo()?.rankForEvolutions || {})?.[0]
        ?.greatLeagueRank.ivs || '';
    const circledIvs = ivs.split('/').reduce((prev, curr) => {
      if (curr) {
        const asNumber = parseInt(curr);
        return prev + this.getCircledNumber(asNumber);
      }
      return prev;
    }, '');
    const ivString = `.${league}${rank} ${circledIvs}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(ivString)
        .then(() => {
          return this.toastController.create({
            message: 'Copied successfully',
            duration: 3000,
            color: 'primary',
            position: 'bottom',
            cssClass: 'centered-toast',
          });
        })
        .then((toast) => toast.present())
        .catch(() => {
          return this.toastController.create({
            message: 'An error occurred',
            duration: 3000,
            color: 'error',
            position: 'bottom',
            cssClass: 'centered-toast',
          });
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

  /**
   * Returns the number, circled, as its unicode
   * Example: 15 = ⑮
   * Will return undefined if number is outside of 0-15 inclusive
   */
  getCircledNumber(number: number): string | undefined {
    if (number < 0 || number > 15) return undefined;
    return String.fromCharCode(9311 + number);
  }
}
