export interface Product {
  id: string
  name: string
  edition: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'aether-one-founders',
    name: 'Aether One',
    edition: 'Founders Edition',
    description: 'A spatial computer for the curious. Move through your ideas, naturally.',
    priceInCents: 29900,
  },
]

export const getProduct = (id: string) => PRODUCTS.find((product) => product.id === id)

export const formatPrice = (priceInCents: number) => `$${(priceInCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
