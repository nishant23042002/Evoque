// app/provide.tsx

"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
export const dynamic = "force-dynamic";

export default function Providers({
    children
}: {
    children: React.ReactNode;
}) {

    console.log("Redux Provider mounted");

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
