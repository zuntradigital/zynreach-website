"use client";

import { useRef, useState } from "react";
import { personaSelector } from "@/lib/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { trackPersonaSelect } from "@/lib/analytics";

export function PersonaSelector() {
  const [activeId, setActiveId] = useState(personaSelector[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const active = personaSelector.find((p) => p.id === activeId) ?? personaSelector[0];

  function focusTab(index: number) {
    const persona = personaSelector[index];
    if (!persona) return;
    setActiveId(persona.id);
    tabRefs.current[persona.id]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab((index + 1) % personaSelector.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab((index - 1 + personaSelector.length) % personaSelector.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(personaSelector.length - 1);
    }
  }

  return (
    <section className="bg-neutral-50 py-20">
      <div className="container-content">
        <SectionHeading eyebrow="Built for your team" headline="Find your solution" />

        <div
          role="tablist"
          aria-label="Solutions by team"
          className="mt-8 flex gap-2 overflow-x-auto pb-2"
        >
          {personaSelector.map((persona, index) => {
            const isActive = persona.id === activeId;
            return (
              <button
                key={persona.id}
                ref={(el) => {
                  tabRefs.current[persona.id] = el;
                }}
                role="tab"
                id={`tab-${persona.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${persona.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  setActiveId(persona.id);
                  trackPersonaSelect(persona.id);
                }}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-primary-600 bg-primary-600 text-white dark:text-neutral-50"
                    : "border-neutral-300 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
                }`}
              >
                {persona.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          tabIndex={0}
          className="mt-8 grid gap-8 rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-8 sm:grid-cols-[2fr_1fr] sm:items-center"
        >
          <div>
            <h3 className="text-2xl font-bold text-neutral-900">{active.headline}</h3>
            <p className="mt-3 text-base leading-normal text-neutral-600">
              {active.description}
            </p>
            <div className="mt-6">
              <Button href={active.href} variant="secondary">
                See how it works
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-primary-50 p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">{active.metric.value}</p>
            <p className="mt-2 text-sm text-neutral-600">{active.metric.label}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
