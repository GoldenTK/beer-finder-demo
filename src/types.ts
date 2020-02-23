export type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

export interface Beer {
  id: number,
  name: string,
  description: string,
  image_url: string,
  brewers_tips: string,
  ibu: number,
  abv: number,
  ingredients: {
    malt: { name: string }[]
  }
}
