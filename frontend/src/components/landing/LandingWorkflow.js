import React from 'react';
import { ClipboardList, FileSearch, MessageSquare, Send } from 'lucide-react';
import SectionHeader from './SectionHeader';
import LandingSection from './LandingSection';
import { landingCopy } from './landingContent';
import { cn } from '../../lib/utils';
import { typography } from '../../lib/designTokens';

const STEP_ICONS = {
  submit: Send,
  review: ClipboardList,
  investigation: FileSearch,
  resolution: MessageSquare,
};

function LandingWorkflow() {
  const { workflow } = landingCopy;

  return (
    <LandingSection id="workflow" variant="muted">
      <SectionHeader
        id="workflow-heading"
        //eyebrow="Process"
        title={workflow.title}
        description={workflow.subtitle}
      />
      <ol className="grid gap-6 md:grid-cols-4 md:gap-4">
        {workflow.steps.map((step, index) => {
          const Icon = STEP_ICONS[step.id] || Send;
          return (
            <li
              key={step.id}
              className="relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-colors duration-200 hover:border-primary/25"
            >
              {index < workflow.steps.length - 1 ? (
                <span
                  className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-border md:block"
                  aria-hidden="true"
                />
              ) : null}
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className={typography.h3}>{step.title}</h3>
              <p className={cn(typography.body, 'mt-2')}>{step.description}</p>
            </li>
          );
        })}
      </ol>
    </LandingSection>
  );
}

export default LandingWorkflow;
