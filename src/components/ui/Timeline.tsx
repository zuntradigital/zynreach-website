interface TimelineEntry {
  year: string;
  headline: string;
  description: string;
}

interface TimelineProps {
  items: TimelineEntry[];
}

/** SRS 11.1 Timeline: horizontal (desktop) / vertical (mobile), rendered as an <ol> regardless of visual presentation. */
export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.year} className="border-s-2 border-primary-200 ps-4 lg:border-s-0 lg:border-t-2 lg:ps-0 lg:pt-4">
          <p className="text-sm font-bold text-primary-600">{item.year}</p>
          <h3 className="mt-1 font-semibold text-neutral-900">{item.headline}</h3>
          <p className="mt-2 text-sm leading-normal text-neutral-600">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
