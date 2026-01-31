export interface ProductSearchFilters {
  "pricing.price"?: { $lte?: number };
  "attributes.fabric"?: string;
  "attributes.fitType"?: string;
}
