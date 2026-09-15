export interface AdminOrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface AdminOrder {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  deliveryType: string;
  address: string | null;
  city: string | null;
  notes: string | null;
  total: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  userId: number | null;
  createdAt: string;
  items: AdminOrderItem[];
}