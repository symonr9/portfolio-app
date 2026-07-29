"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type WorkDetailPanel = {
  id: string;
  label: string;
  content: ReactNode;
};

export function WorkDetailTabs({ panels }: { panels: WorkDetailPanel[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const instanceId = useId();

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % panels.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + panels.length) % panels.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = panels.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-sm border border-foreground/10 bg-surface">
      <div
        aria-label="Work sample information"
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-foreground/10 p-1.5"
        role="tablist"
      >
        {panels.map((panel, index) => {
          const selected = index === activeIndex;
          const tabId = `${instanceId}-${panel.id}-tab`;
          const panelId = `${instanceId}-${panel.id}-panel`;

          return (
            <button
              aria-controls={panelId}
              aria-selected={selected}
              className={[
                "min-h-9 shrink-0 rounded-sm px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
                selected
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-foreground/6 hover:text-foreground",
              ].join(" ")}
              id={tabId}
              key={panel.id}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {panel.label}
            </button>
          );
        })}
      </div>

      {panels.map((panel, index) => {
        const selected = index === activeIndex;

        return (
          <div
            aria-labelledby={`${instanceId}-${panel.id}-tab`}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"
            hidden={!selected}
            id={`${instanceId}-${panel.id}-panel`}
            key={panel.id}
            role="tabpanel"
            tabIndex={0}
          >
            {panel.content}
          </div>
        );
      })}
    </section>
  );
}
