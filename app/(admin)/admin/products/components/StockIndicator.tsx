interface Props {
  stock: number;
}

export default function StockIndicator({ stock }: Props) {
  if (stock === 0)
    return (
      <span className="text-red-500 font-medium">
        Out of Stock
      </span>
    );

  if (stock < 5)
    return (
      <span className="text-yellow-400 font-medium">
        Low ({stock})
      </span>
    );

  return (
    <span className="text-green-400">
      {stock}
    </span>
  );
}