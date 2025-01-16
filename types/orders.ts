export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  size: string;
  quantity: number;
  price: number;
  createdat: string;
}

export interface Order {
  id: number;
  user_id: string;
  status: OrderStatus;
  total_items: number;
  total_amount: number;
  createdat: string;
  updatedat: string;
  items?: OrderItem[];
}

export interface UserDashboardData {
  stats: {
    total_orders: number;
    pending_orders: number;
    total_products: number;
    monthly_growth: number;
  };
  recentOrders: Array<{
    id: number;
    date: string;
    status: OrderStatus;
    total_items: number;
    total_amount: number;
  }>;
  ordersByStatus: Array<{
    status: OrderStatus;
    count: number;
  }>;
  monthlyOrders: Array<{
    month: string;
    orders: number;
    amount: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
  }>;
} 