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
