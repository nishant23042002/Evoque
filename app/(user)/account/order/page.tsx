"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Order } from "@/types/OrderTypes";
import { useRouter } from "next/navigation";


const statusStyle: Record<string, string> = {
  confirmed: "bg-yellow-400 text-white",
  processing: "bg-blue-500 text-white",
  shipped: "bg-purple-500 text-white",
  delivered: "bg-green-600 text-white",
  cancelled: "bg-red-600 text-white",
  returned: "bg-gray-500 text-white",
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const router = useRouter();


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
                flex flex-row
                gap-4 
                p-2
                hover:bg-gray-50 transition
              "
              >
                {/* TOP ROW MOBILE */}
                <div className="flex gap-4 w-full">
                  {/* IMAGE */}
                  <div onClick={() => router.push(`/products/${firstItem.slug}`)} className="
                  relative cursor-pointer
                   sm:aspect-4/5 
                ">
                    {firstItem?.image && (
                      <Image
                        src={firstItem.image}
                        alt={firstItem.name}
                        fill
                        className="object-cover"
                      />
                    )}

                    <div className="absolute inset-0 hover:bg-black/20" />
                  </div>

                  {/* DETAILS */}
                  <div className="relative flex-1 my-3">
                    <p className="text-sm uppercase font-medium tracking-wide line-clamp-1">
                      {firstItem?.name}
                    </p>

                    <div className="my-2">
                      <p className="uppercase text-xs tracking-widest">
                        <span className="text-[11px]">Size: </span>{firstItem?.size || "-"}
                      </p>

                      <div className="text-xs uppercase tracking-widest">
                        <p className="text-[10px]"><span className="text-[11px]">Order Id: </span>{order.paymentInfo.orderId}</p>
                        <p className="text-[10px]"><span className="text-[11px]">Payment Method: </span>{order.paymentInfo.method}</p>
                      </div>
                    </div>

                    {/* STATUS */}
                    <span
                      className={clsx(
                        "inline-block mt-1 sm:mt-2 text-[11px] px-2 sm:px-3 py-1 uppercase tracking-widest",
                        statusStyle[order.orderStatus]
                      )}
                    >
                      status: {order.orderStatus}
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
                <div className={`overflow-hidden ${isOpen && "border-t border-black/10"}`}>
                  <div className="
                  p-4
                  space-y-8 sm:space-y-10
                  bg-gray-50
                ">

                    {/* ITEMS */}
                    <div className="">
                      {order.items.map(item => (
                        <div
                          key={item.sku}
                          className="
                          flex flex-col sm:flex-row
                          gap-4 sm:gap-6
                        "
                        >
                          <div onClick={() => router.push(`/products/${item.slug}`)} className="
                          relative
                          w-14 h-18
                          sm:w-20 sm:h-24
                          overflow-hidden cursor-pointer
                        ">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            )}

                            <div className="absolute inset-0 hover:bg-black/20 " />
                          </div>

                          <div className="text-sm space-y-1">
                            <p className="font-medium uppercase tracking-wide">
                              {item.name}
                            </p>

                            <div className="py-2">
                              <p className="text-[11px] flex gap-4 uppercase tracking-widest">
                                <span>Qty: {item.quantity} </span>
                                <span>Rs. {item.price} </span>
                              </p>

                              <div className="
                              text-[11px]
                              uppercase tracking-widest
                              flex flex-col
                            ">
                                {item.size && <span>Size: {item.size}</span>}
                                {item.color && <span>Color: {item.color}</span>}
                                Discount: {order.discountAmount} Rs
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* RATE */}
                    <div className="border border-black/10 p-4 sm:p-6 bg-white space-y-2">
                      <p className="text-[11px] sm:text-xs uppercase tracking-widest font-medium">
                        Rate Product
                      </p>
                      <div className="text-lg sm:text-xl text-gray-300">
                        ★★★★★
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="border border-black/10 p-4 sm:p-6 bg-white space-y-2 text-sm">
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
                    uppercase tracking-widest
                    space-y-1
                  ">
                      <p>
                        Ordered on:  {new Date(order.createdAt).toDateString()}
                      </p>
                      <p>Total Paid: Rs. {order.grandTotal}</p>
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
