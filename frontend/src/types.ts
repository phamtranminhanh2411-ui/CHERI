export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "tops" | "bottoms" | "dresses" | "outerwear";
  categoryName: string;
  image: string;
  secondaryImage: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  details: string[];
  rating: number;
  isNew?: boolean;
  inStock: boolean;
  images?: string[];
  classifications?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  size?: string;
  color?: { name: string; hex: string };
  classification?: string;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
  colorName: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "shipped" | "delivered";
  statusText: string;
  address: string;
  phone: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  avatar: string;
  orders: Order[];
}
