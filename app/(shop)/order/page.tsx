"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

type OrderItem = {
  productId: string;
  name: string;
  image: string;
  size?: string;
  color?: string;
  sku: string;
  quantity: number;
  price: number;
};

type Order = {
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
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders/my")
      .then(res => res.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-lg font-semibold">No orders yet</h2>
          <p className="text-sm text-gray-500 mt-1">
            Your orders will appear here once you make a purchase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 h-[95vh]">
      <h1 className="text-2xl font-semibold">My Orders</h1>

      {orders.map(order => {
        const isOpen = openOrder === order._id;

        return (
          <div
            key={order._id}
            className="border rounded bg-white"
          >
            {/* HEADER */}
            <button
              onClick={() =>
                setOpenOrder(isOpen ? null : order._id)
              }
              className="w-full text-left p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">
                  Order #{order.orderNumber}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={clsx(
                    "text-xs px-2 py-1 rounded capitalize",
                    {
                      "bg-green-100 text-green-700":
                        order.orderStatus === "delivered",
                      "bg-blue-100 text-blue-700":
                        order.orderStatus === "shipped",
                      "bg-yellow-100 text-yellow-700":
                        order.orderStatus === "processing",
                      "bg-gray-200 text-gray-700":
                        order.orderStatus === "confirmed",
                      "bg-red-100 text-red-700":
                        order.orderStatus === "cancelled",
                    }
                  )}
                >
                  {order.orderStatus.replace("_", " ")}
                </span>

                <span className="font-semibold">
                  ₹{order.grandTotal}
                </span>
              </div>
            </button>

            {/* EXPANDED */}
            {isOpen && (
              <div className="border-t px-4 pb-4 space-y-4">
                {/* ITEMS */}
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div
                      key={item.sku}
                      className="flex gap-3"
                    >
                      <div className="relative w-16 h-20 bg-gray-100">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 text-sm">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty {item.quantity} · ₹{item.price}
                        </p>
                        {item.size && (
                          <p className="text-xs text-gray-400">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADDRESS */}
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-700">
                    Delivered to
                  </p>
                  <p>
                    {order.shippingAddress.name},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}{" "}
                    {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
