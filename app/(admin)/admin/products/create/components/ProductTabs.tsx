interface Props {
  active: string
  setActive: (tab: string) => void
}

export default function ProductTabs({
  active,
  setActive,
}: Props) {
  const tabs = ["Basic", "Pricing", "Thumbnail", "Variants"];

  return (
    <div className="flex gap-4 border-b border-zinc-800 pb-3">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={
            active === tab
              ? "text-white"
              : "text-zinc-500"
          }
        >
          {tab}
        </button>
      ))}
    </div>
  )
}