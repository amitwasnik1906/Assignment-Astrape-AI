export interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
  }
  
  export interface Item {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    inStock: boolean;
    stock: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CartItem {
    item: Item;
    quantity: number;
    _id: string;
  }
  
  export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
  }
  
  export interface CartContextType {
    cart: Cart | null;
    addToCart: (itemId: string, quantity?: number) => Promise<void>;
    updateCartItem: (itemId: string, quantity: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    loading: boolean;
  }