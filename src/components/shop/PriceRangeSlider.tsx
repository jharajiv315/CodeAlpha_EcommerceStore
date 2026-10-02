import React, { useId } from 'react';
import { formatPrice } from '../../utils/currency';
import { RotateCcw } from 'lucide-react';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
  onChange: (min: number, max: number) => void;
  compact?: boolean;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  minLimit = 0,
  maxLimit = 350000,
  step = 1000,
  onChange,
  compact = false,
}) => {
  const minInputId = useId();
  const maxInputId = useId();

  // Normalize maxPrice if unbounded (e.g. 500000)
  const isUnbounded = maxPrice >= maxLimit;
  const currentMax = isUnbounded ? maxLimit : maxPrice;
  const currentMin = Math.max(minLimit, minPrice);

  const minPercent = Math.min(100, Math.max(0, ((currentMin - minLimit) / (maxLimit - minLimit)) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((currentMax - minLimit) / (maxLimit - minLimit)) * 100));

  // Determine if the min and max dynamic labels would collide
  const isCollision = (maxPercent - minPercent) < 24;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), currentMax - step);
    onChange(value, isUnbounded ? 500000 : currentMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const value = Math.max(val, currentMin + step);
    // If user dragged to max edge, treat as unbounded (500000) so no high items are cut off
    onChange(currentMin, value >= maxLimit ? 500000 : value);
  };

  const handleManualMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value.replace(/\D/g, ''));
    if (!isNaN(num)) {
      const clamped = Math.min(Math.max(minLimit, num), currentMax - step);
      onChange(clamped, isUnbounded ? 500000 : currentMax);
    }
  };

  const handleManualMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value.replace(/\D/g, ''));
    if (!isNaN(num)) {
      const clamped = Math.max(num, currentMin + step);
      onChange(currentMin, clamped >= maxLimit ? 500000 : clamped);
    }
  };

  const resetPrice = () => {
    onChange(minLimit, 500000);
  };

  const isFiltered = currentMin > minLimit || !isUnbounded;

  // Clamp percentage between 10% and 90% so dynamic label tooltips stay within card bounds
  const clampedMinLabelPos = Math.min(90, Math.max(10, minPercent));
  const clampedMaxLabelPos = Math.min(90, Math.max(10, maxPercent));
  const mergedLabelPos = Math.min(88, Math.max(12, (minPercent + maxPercent) / 2));

  return (
    <div className={`space-y-4 ${compact ? 'text-xs' : 'text-sm'}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#666B67]">
          Price Filter
        </span>
        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              type="button"
              onClick={resetPrice}
              className="flex items-center gap-1 text-[11px] font-medium text-[#666B67] hover:text-[#123C35] p-0.5 rounded cursor-pointer transition-colors"
              title="Reset price range"
              aria-label="Reset price range"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Dual Slider Graphic Track with Floating Dynamic Labels */}
      <div className="relative pt-7 pb-2 px-1">
        {/* Dynamic Floating Price Labels */}
        {isCollision ? (
          // Merged Dynamic Label when thumbs are adjacent to avoid overlap
          <div
            className="absolute top-0 -translate-x-1/2 bg-[#123C35] text-[#FFFFFF] shadow-sm px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums whitespace-nowrap pointer-events-none transition-all duration-75 flex items-center gap-1 z-30"
            style={{ left: `${mergedLabelPos}%` }}
          >
            <span>{formatPrice(currentMin)}</span>
            <span className="opacity-60 font-normal">–</span>
            <span>{isUnbounded ? `${formatPrice(maxLimit)}+` : formatPrice(currentMax)}</span>
            {/* Subtle pointer arrowhead */}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#123C35] rotate-45" />
          </div>
        ) : (
          // Independent Dynamic Labels tracking each thumb handle
          <>
            {/* Min Value Dynamic Label */}
            <div
              className="absolute top-0 -translate-x-1/2 bg-[#FFFFFF] border border-[#E4E1DA] text-[#123C35] shadow-xs px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums whitespace-nowrap pointer-events-none transition-all duration-75 z-30"
              style={{ left: `${clampedMinLabelPos}%` }}
            >
              <span>{formatPrice(currentMin)}</span>
              {/* Subtle pointer arrowhead */}
              <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFFFFF] border-b border-r border-[#E4E1DA] rotate-45" />
            </div>

            {/* Max Value Dynamic Label */}
            <div
              className="absolute top-0 -translate-x-1/2 bg-[#FFFFFF] border border-[#E4E1DA] text-[#123C35] shadow-xs px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums whitespace-nowrap pointer-events-none transition-all duration-75 z-30"
              style={{ left: `${clampedMaxLabelPos}%` }}
            >
              <span>{isUnbounded ? `${formatPrice(maxLimit)}+` : formatPrice(currentMax)}</span>
              {/* Subtle pointer arrowhead */}
              <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFFFFF] border-b border-r border-[#E4E1DA] rotate-45" />
            </div>
          </>
        )}

        {/* Background Rail */}
        <div className="w-full h-1.5 bg-[#E4E1DA] rounded-full overflow-hidden relative">
          {/* Active Highlighted Interval */}
          <div
            className="absolute top-0 bottom-0 bg-[#123C35] rounded-full transition-all duration-75"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
        </div>

        {/* Min Thumb Input */}
        <input
          type="range"
          id={minInputId}
          min={minLimit}
          max={maxLimit}
          step={step}
          value={currentMin}
          onChange={handleMinChange}
          aria-label="Minimum price filter"
          className="slider-thumb-minimal absolute inset-x-0 bottom-2 w-full h-4 cursor-pointer z-20 m-0"
        />

        {/* Max Thumb Input */}
        <input
          type="range"
          id={maxInputId}
          min={minLimit}
          max={maxLimit}
          step={step}
          value={currentMax}
          onChange={handleMaxChange}
          aria-label="Maximum price filter"
          className="slider-thumb-minimal absolute inset-x-0 bottom-2 w-full h-4 cursor-pointer z-20 m-0"
        />

        {/* Extremity Boundary Scale Labels */}
        <div className="flex items-center justify-between text-[10px] text-[#666B67] pt-1.5 select-none">
          <span className="tabular-nums">Min {formatPrice(minLimit)}</span>
          <span className="tabular-nums">Max {formatPrice(maxLimit)}+</span>
        </div>
      </div>

      {/* Manual Input Fields & Currency Display */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#666B67] uppercase tracking-wider font-medium">
          <span>Min Value</span>
          <span>Max Value</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#666B67] select-none font-medium">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={currentMin}
              onChange={handleManualMin}
              className="w-full bg-[#FFFFFF] border border-[#E4E1DA] focus:border-[#123C35] focus:outline-none focus:ring-1 focus:ring-[#123C35] rounded-lg pl-6 pr-2 py-1.5 text-xs font-semibold text-[#171A19] tabular-nums transition-colors"
              placeholder="Min"
              aria-label="Minimum price in Rupees"
            />
          </div>

          <span className="text-xs text-[#666B67] select-none">—</span>

          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#666B67] select-none font-medium">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={isUnbounded ? maxLimit : currentMax}
              onChange={handleManualMax}
              className="w-full bg-[#FFFFFF] border border-[#E4E1DA] focus:border-[#123C35] focus:outline-none focus:ring-1 focus:ring-[#123C35] rounded-lg pl-6 pr-2 py-1.5 text-xs font-semibold text-[#171A19] tabular-nums transition-colors"
              placeholder="Max"
              aria-label="Maximum price in Rupees"
            />
          </div>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="space-y-1.5 pt-1 border-t border-[#E4E1DA]/60">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#666B67] block">
          Quick Filters
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: 'All Prices', min: 0, max: 100000 },
            { label: '< ₹3,000', min: 0, max: 3000 },
            { label: '₹3k – ₹10k', min: 3000, max: 10000 },
            { label: '> ₹10,000', min: 10000, max: 100000 },
          ].map(preset => {
            const isSelected =
              preset.max >= 100000
                ? currentMin === preset.min && isUnbounded
                : currentMin === preset.min && currentMax === preset.max;

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.min, preset.max)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#EDE4D2] text-[#123C35] font-semibold border border-[#123C35]/20'
                    : 'bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#666B67] hover:text-[#171A19] border border-transparent'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
