export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;          
  originalPrice?: number; 
  quantity: number;
  size?: string;
  brand: string;
}
