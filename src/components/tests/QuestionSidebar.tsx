import { Check, ChevronsLeft, ChevronsRight, Minus } from 'lucide-react';
import { useState } from 'react';

interface QuestionSidebarProps {
  totalQuestions: number;
  isSlotComplete: (index: number) => boolean;
  activeSlot: number;
  onSelect: (index: number) => void;
}

export function QuestionSidebar({ totalQuestions, isSlotComplete, activeSlot, onSelect }: QuestionSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <aside className="question-sidebar question-sidebar--collapsed">
        <button type="button" className="question-sidebar__toggle" onClick={() => setCollapsed(false)} aria-label="Expand question list">
          <ChevronsRight size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="question-sidebar">
      <div className="question-sidebar__header">
        <h2>Question creation</h2>
        <button type="button" className="question-sidebar__toggle" onClick={() => setCollapsed(true)} aria-label="Collapse question list">
          <ChevronsLeft size={18} />
        </button>
      </div>
      <p className="question-sidebar__count">Total Questions . {totalQuestions}</p>
      <div className="question-sidebar__list">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const isDone = isSlotComplete(index);
          const isActive = index === activeSlot;
          const isPending = !isDone && !isActive;

          return (
            <button
              key={index}
              type="button"
              className={`question-sidebar__item${isDone ? ' done' : ''}${isActive ? ' active' : ''}${isPending ? ' pending' : ''}`}
              onClick={() => onSelect(index)}
            >
              <span className="question-sidebar__status" aria-hidden="true">
                {isDone ? <Check size={14} /> : <Minus size={14} />}
              </span>
              <span>Question {index + 1}</span>
              <ChevronsRight size={16} className="question-sidebar__chevron" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
