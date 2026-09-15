import { StepperStepData } from '../../../types/home';

interface SelectionStepperProps {
  steps: StepperStepData[];
  /**
   * Warna garis penghubung antar step, panjang array = steps.length - 1.
   * Isi string kosong ('') jika segmen tersebut tidak diwarnai (abu-abu default).
   * Contoh untuk 4 step: ['bg-emerald-500', 'bg-rose-500', 'bg-rose-500']
   */
  segmentColors: string[];
}

export function SelectionStepper({ steps, segmentColors }: SelectionStepperProps) {
  const gapCount = Math.max(steps.length - 1, 1);

  return (
    <div className="grid grid-cols-4 gap-2 text-center relative">
      {/* Garis dasar abu-abu */}
      <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-10" />

      {/* Overlay warna per segmen */}
      {segmentColors.map((color, i) => {
        if (!color) return null;
        const leftFraction = i / gapCount;
        const widthFraction = 1 / gapCount;
        return (
          <div
            key={i}
            className={`absolute top-4 h-0.5 -z-10 ${color}`}
            style={{
              left: `calc(1.5rem + (100% - 3rem) * ${leftFraction})`,
              width: `calc((100% - 3rem) * ${widthFraction})`,
            }}
          />
        );
      })}

      {steps.map((step) => (
        <div key={step.id} className={`flex flex-col items-center ${step.muted ? 'opacity-60' : ''}`}>
          <div
            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shadow-xs ${step.circleClassName}`}
          >
            {step.id}
          </div>
          <span className={`text-xs font-bold mt-2 block ${step.labelClassName ?? 'text-[#1e293b]'}`}>
            {step.title}
          </span>
          {step.dateLines && (
            <span className={`text-[11px] mt-1 ${step.dateClassName ?? 'text-slate-400'}`}>
              {step.dateLines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}