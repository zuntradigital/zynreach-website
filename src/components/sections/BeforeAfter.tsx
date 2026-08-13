interface BeforeAfterProps {
  before: { label: string; body: string };
  after: { label: string; body: string };
}

/** SRS 7.8 "before/after narrative", generalized from Home's Problem/Solution pattern. */
export function BeforeAfter({ before, after }: BeforeAfterProps) {
  return (
    <section className="bg-white dark:bg-neutral-100 py-20">
      <div className="container-content">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{before.label}</p>
            <p className="mt-3 text-base leading-normal text-neutral-700">{before.body}</p>
          </div>
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">{after.label}</p>
            <p className="mt-3 text-base leading-normal text-neutral-800">{after.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
