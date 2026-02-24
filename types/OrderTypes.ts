


export interface OrderItem {
    productId: string;
    name: string;
    image: string;
    size?: string;
    color?: string;
    sku: string;
    quantity: number;
    price: number;
    slug?: string;
    discountAmount: number
};



export interface Order {
    _id: string;
    orderNumber: string;
    orderStatus: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    items: OrderItem[];
    grandTotal: number;
    createdAt: string;
    shippingAddress: {
        name: string;
        city: string;
        state: string;
        pincode: string;
    };
    paymentInfo: {
        method: string;
        orderId: string;
        status: string;
    }
    discountAmount: number
};