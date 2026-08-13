import { problemSolution } from "@/lib/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProblemSolution() {
  return (
    <section className="bg-white dark:bg-neutral-100 py-20">
      <div className="container-content">
        <SectionHeading
          eyebrow={problemSolution.eyebrow}
          headline={problemSolution.headline}
          align="center"
          className="max-w-3xl"
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              {problemSolution.problem.label}
            </p>
            <p className="mt-3 text-base leading-normal text-neutral-700">
              {problemSolution.problem.body}
            </p>
          </div>
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              {problemSolution.solution.label}
            </p>
            <p className="mt-3 text-base leading-normal text-neutral-800">
              {problemSolution.solution.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
