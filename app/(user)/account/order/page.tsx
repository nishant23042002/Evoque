"use client";

import { useAuth } from "@/components/AuthProvider";
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
  paymentInfo: {
    method: string;
    orderId: string;
    status: string;
  }
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    fetch("/api/orders/my")
      .then(res => res.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.reload(); // hard clear state
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="text-sm text-gray-500 mt-2">
            Your orders will appear here once you make a purchase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl h-[95vh] overflow-auto scrollbar-hide mx-auto space-y-2">
      <div className="space-y-4 py-2 h-165 overflow-auto scrollbar-hide">
        {orders.map(order => {
          const isOpen = openOrder === order._id;
          const firstItem = order.items[0];

          return (
            <div
              key={order._id}
              className="border rounded-[3px] overflow-hidden transition"
            >
              {/* ===== HEADER ROW (MYNTRA STYLE) ===== */}
              <button
                onClick={() => setOpenOrder(isOpen ? null : order._id)}
                className="w-full text-left p-2 flex gap-4 cursor-pointer duration-300 hover:bg-(--linen-200) transition"
              >
                {/* IMAGE */}
                <div className="relative w-20 h-24 rounded-[3px] overflow-hidden bg-gray-100">
                  {firstItem?.image && (
                    <Image
                      src={firstItem.image}
                      alt={firstItem.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* DETAILS */}
                <div className="flex-1 space-y-1">
                  
                  <p className="font-medium text-gray-900 line-clamp-1">
                    {firstItem?.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    Size: {firstItem?.size || "-"}
                  </p>
                  <div>
                    <p className="text-xs text-gray-400">
                      Order-Id:  {order.paymentInfo.orderId}
                    </p>
                    <p className="text-xs text-gray-400">Payment Via: {order.paymentInfo.method}</p>
                  </div>

                  <div className="mt-2">
                    <span className="inline-block bg-green-600 text-white text-xs px-3 py-1 rounded">
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* PRICE */}
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{order.grandTotal}</p>
                </div>
              </button>

              {/* ===== EXPAND SECTION ===== */}
              <div
                className={clsx(
                  "grid transition-all duration-500",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className={`overflow-hidden ${isOpen && "border-t"}`}>

                  <div className="p-4 space-y-6">

                    {/* ALL ITEMS */}
                    <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.sku} className="flex flex-col justify-center items-center gap-4">
                          <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100">
                            {item.image && (
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            )}
                          </div>

                          <div className="flex flex-col justify-center flex-1 items-center text-sm">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500">
                              Qty {item.quantity} · ₹{item.price}
                            </p>
                            <div className="text-xs text-gray-400 flex gap-3 mt-1">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* RATE PRODUCT */}
                    <div className="border rounded-md p-3">
                      <p className="font-medium text-sm mb-2">Rate this product</p>
                      <div className="flex gap-1 text-gray-300 text-xl">
                        ★★★★★
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="border rounded-md p-3 text-sm">
                      <p className="font-medium mb-1">Delivery Address</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.name}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} {order.shippingAddress.pincode}
                      </p>
                    </div>

                    {/* ORDER META */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Ordered on {new Date(order.createdAt).toDateString()}</p>
                      <p>Total Paid: ₹{order.grandTotal}</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-[90%] max-w-sm p-6 rounded-[3px] border bg-white shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="text-sm mt-2 text-gray-600">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
