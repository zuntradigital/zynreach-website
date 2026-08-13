import { ArrowRight } from "lucide-react";

interface WorkflowDiagramProps {
  steps: string[];
}

/** SRS 7.10: "Industry-specific workflow diagram." */
export function WorkflowDiagram({ steps }: WorkflowDiagramProps) {
  return (
    <ol className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          <div className="flex min-w-[10rem] flex-1 items-center gap-3 rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100 px-4 py-3 shadow-card">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white dark:text-neutral-50">
              {index + 1}
            </span>
            <span className="text-sm font-medium text-neutral-800">{step}</span>
          </div>
          {index < steps.length - 1 ? (
            <ArrowRight
              aria-hidden="true"
              className="hidden h-5 w-5 flex-shrink-0 text-neutral-300 rtl:rotate-180 sm:block"
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
