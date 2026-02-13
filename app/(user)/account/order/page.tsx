"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Order } from "@/types/OrderTypes";


const statusStyle: Record<string, string> = {
  confirmed: "border-yellow-500 text-yellow-600",
  processing: "border-blue-500 text-blue-600",
  shipped: "border-purple-500 text-purple-600",
  delivered: "border-green-600 text-green-600",
  cancelled: "border-red-600 text-red-600",
  returned: "border-gray-500 text-gray-600",
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
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-wide uppercase">
            No Orders Yet
          </h2>
          <p className="text-sm text-gray-500">
            Your purchases will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-2 sm:px-4 py-2 space-y-4 sm:space-y-6">
        {orders.map(order => {
          const isOpen = openOrder === order._id;
          const firstItem = order.items[0];

          return (
            <div
              key={order._id}
              className="border border-gray-200 transition hover:border-black"
            >
              {/* HEADER */}
              <button
                onClick={() => setOpenOrder(isOpen ? null : order._id)}
                className="
                w-full text-left
                flex flex-col sm:flex-row
                gap-4 
                p-4
                hover:bg-gray-50 transition
              "
              >
                {/* TOP ROW MOBILE */}
                <div className="flex gap-4 w-full">
                  {/* IMAGE */}
                  <div className="
                  relative
                  w-14 h-18
                  sm:w-16 sm:h-20
                  border overflow-hidden
                ">
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
                  <div className="relative flex-1 space-y-1">
                    <p className="text-sm font-medium tracking-wide line-clamp-1">
                      {firstItem?.name}
                    </p>

                    <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-widest">
                      Size {firstItem?.size || "-"}
                    </p>

                    <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest space-y-1">
                      <p>Order ID {order.paymentInfo.orderId}</p>
                      <p>{order.paymentInfo.method}</p>
                    </div>

                    {/* STATUS */}
                    <span
                      className={clsx(
                        "inline-block mt-1 sm:mt-2 text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 border uppercase tracking-widest",
                        statusStyle[order.orderStatus]
                      )}
                    >
                      {order.orderStatus}
                    </span>
                    <div className="
                      absolute right-0 bottom-2 sm:ml-auto text-end
                      text-sm font-semibold tracking-wide
                      mt-2 sm:mt-0
                    ">
                      Rs. {order.grandTotal}
                    </div>
                  </div>
                </div>
              </button>

              {/* EXPAND */}
              <div
                className={clsx(
                  "grid transition-all duration-500",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className={`overflow-hidden ${isOpen && "border-t"}`}>
                  <div className="
                  p-4 sm:p-6 lg:p-8
                  space-y-8 sm:space-y-10
                  bg-gray-50
                ">

                    {/* ITEMS */}
                    <div className="space-y-6">
                      {order.items.map(item => (
                        <div
                          key={item.sku}
                          className="
                          flex flex-col sm:flex-row
                          gap-4 sm:gap-6
                        "
                        >
                          <div className="
                          relative
                          w-14 h-18
                          sm:w-16 sm:h-20
                          border overflow-hidden
                        ">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          <div className="text-sm space-y-1">
                            <p className="font-medium tracking-wide">
                              {item.name}
                            </p>

                            <p className="text-gray-500 text-[11px] sm:text-xs uppercase tracking-widest">
                              Qty {item.quantity} · Rs. {item.price}
                            </p>

                            <div className="
                            text-[10px] sm:text-[11px]
                            text-gray-400 uppercase tracking-widest
                            flex gap-3 sm:gap-4
                          ">
                              {item.size && <span>Size {item.size}</span>}
                              {item.color && <span>{item.color}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* RATE */}
                    <div className="border p-4 sm:p-6 bg-white space-y-2">
                      <p className="text-[11px] sm:text-xs uppercase tracking-widest font-medium">
                        Rate Product
                      </p>
                      <div className="text-lg sm:text-xl text-gray-300">
                        ★★★★★
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="border p-4 sm:p-6 bg-white space-y-2 text-sm">
                      <p className="text-[11px] sm:text-xs uppercase tracking-widest font-medium">
                        Delivery Address
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {order.shippingAddress.name},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.pincode}
                      </p>
                    </div>

                    {/* META */}
                    <div className="
                    text-[11px] sm:text-xs
                    text-gray-500 uppercase tracking-widest
                    space-y-1
                  ">
                      <p>
                        Ordered {new Date(order.createdAt).toDateString()}
                      </p>
                      <p>Total Paid Rs. {order.grandTotal}</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

}
