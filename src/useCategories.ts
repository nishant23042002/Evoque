"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/categories";

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30,
  });
}
