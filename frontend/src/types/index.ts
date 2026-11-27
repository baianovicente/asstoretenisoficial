export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  promoPrice?: number;
  images: string[];
  sizes: number[];
  category: 'masculino' | 'feminino' | 'lancamentos' | 'promocoes';
  style: 'corrida' | 'casual' | 'skate' | 'basquete';
  stock: number;
  isNew?: boolean;
  isLastUnits?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'pix' | 'card' | 'boleto';
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
}
