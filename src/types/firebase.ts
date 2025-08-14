export interface Client {
  id: string;
  name: string;
  slug: string;
  description?: string;
  app_url: string;
  logo_url?: string;
  active: boolean;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  created_at: Date;
}

export interface Product {
  id: string;
  name: string;
  category_id: string;
  sizes: Record<string, any>;
  available_toppings: string[];
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  order_number: string;
  items: Record<string, any>;
  total_amount: number;
  payment_method: string;
  payment_phone?: string;
  status: string;
  cashier_id: string;
  created_at: Date;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}