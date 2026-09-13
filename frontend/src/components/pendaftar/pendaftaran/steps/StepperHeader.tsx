import { STEPS_LIST } from '../../types';

interface StepperHeaderProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepperHeader({ currentStep, onStepClick }: StepperHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs overflow-x-auto">
      <div className="min-w-[650px] flex items-center justify-between relative px-4">
        {STEPS_LIST.map((step, idx) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;

          return (
            <div key={step.num} className="flex-1 flex items-center relative">
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onStepClick(step.num)}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-extrabold text-xs sm:text-sm flex items-center justify-center transition-all ${
                    isActive || isCompleted
                      ? 'bg-[#1f877c] text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.num}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold mt-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#1f877c]'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < STEPS_LIST.length - 1 && (
                <div className="flex-1 h-[3px] mx-3 sm:mx-6 bg-slate-200 rounded-full relative -top-3">
                  <div
                    className="h-full bg-[#1f877c] transition-all duration-300 rounded-full"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}