export type UserRole = 'admin' | 'client';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt?: string;
  phone?: string;
  address?: string;
}

export interface UserOrder {
  id: string;
  userId: string;
  userEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    selectedColor?: { name: string; hex: string };
    selectedSize?: string;
    image?: string;
  }>;
  shippingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  statusUpdatedAt?: string;
  statusHistory?: Array<{
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
    at: string;
  }>;
  createdAt: string;
}
