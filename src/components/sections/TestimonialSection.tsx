import { Quote } from "lucide-react";
import { customerProof } from "@/lib/content/home";
import type { TestimonialItem } from "@/types/content";

interface TestimonialSectionProps {
  item?: TestimonialItem;
}

export function TestimonialSection({ item = customerProof }: TestimonialSectionProps) {
  return (
    <section className="bg-white dark:bg-neutral-100 py-20">
      <div className="container-content">
        <div className="mx-auto grid max-w-4xl gap-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:grid-cols-[1fr_auto] sm:p-12">
          <div>
            <Quote aria-hidden="true" className="h-8 w-8 text-primary-300" strokeWidth={1.5} />
            <blockquote className="mt-4 text-xl font-medium leading-normal text-neutral-900 sm:text-2xl">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <p className="mt-6 text-sm font-semibold text-neutral-900">{item.authorTitle}</p>
            <p className="text-sm text-neutral-500">{item.company}</p>
          </div>
          {item.metric ? (
            <div className="flex flex-col items-center justify-center border-t border-neutral-200 pt-6 sm:border-t-0 sm:border-s sm:pt-0 sm:ps-8">
              <p className="text-4xl font-bold text-primary-600">{item.metric.value}</p>
              <p className="mt-2 max-w-[10rem] text-center text-sm text-neutral-600">
                {item.metric.label}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
