export interface Pokemon {
  id: string;
  formId: string;
  dexNr: number;
  generation: number;
  names: {
    [languageCode: string]: string;
  };
  stats: {
    hp: number;
    attack: number;
    defense: number;
  };
  primaryType: {
    typeName: string;
  };
  secondaryType: {
    typeName: string;
  };
  assets: {
    image: string;
  };
  evolutions: {
    evolvedPokemonID: string;
  }[];
}
