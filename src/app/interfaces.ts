export interface Pokemon {
  id: string;
  formId: string;
  dexNr: number;
  generation: number;
  names: {
    [languageCode: string]: string;
  };
  stats: {
    stamina: number;
    attack: number;
    defense: number;
  };
  primaryType: {
    type: string;
    names: {
      [languageCode: string]: string;
    };
  };
  secondaryType: {
    type: string;
    names: {
      [languageCode: string]: string;
    };
  };
  assets: {
    image: string;
  };
  evolutions: {
    evolvedPokemonID: string;
  }[];
}

export interface RankInfo {
  all: number;
  bestFriend: number;
  goodFriend: number;
  greatFriend: number;
  hatched: number;
  luckyFriend: number;
  ultraFriend: number;
  weatherBoosted: number;
}

export interface Stats {
  atk: number;
  def: number;
  hp: number;
}

export interface EvolutionData {
  ranks: RankInfo;
  ivs: string;
  level: number;
  cp: number;
  statProduct: number;
  percent: number;
  stats: Stats;
}

export interface Ranks {
  greatLeagueRank: EvolutionData;
  ultraLeagueRank: EvolutionData;
}

export interface PokemonData {
  [pokemon: string]: Ranks;
}

export interface PokemonRankInfoForEvolutions {
  evolutions: string[];
  rankForEvolutions: PokemonData;
}
