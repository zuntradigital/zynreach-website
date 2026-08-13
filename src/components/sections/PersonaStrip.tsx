import { Link } from "@/i18n/navigation";

interface PersonaStripProps {
  items: { label: string; href: string }[];
  builtForLabel: string;
}

/** "Who it's for" persona-chip strip (SRS 7.3), linking to Solutions pages. */
export function PersonaStrip({ items, builtForLabel }: PersonaStripProps) {
  return (
    <section className="border-b border-neutral-100 bg-white dark:bg-neutral-100 py-8">
      <div className="container-content flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-neutral-500">{builtForLabel}</span>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:text-primary-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
