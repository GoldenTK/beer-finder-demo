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
