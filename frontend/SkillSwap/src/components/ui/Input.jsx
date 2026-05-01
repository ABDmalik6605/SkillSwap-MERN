import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, ...props }, ref) => (
  <label className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
    <span className="font-bold text-slate-800">{label}</span>
    <input
      ref={ref}
      className="border-2 sm:border-3 border-purple-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-purple-400 focus:border-purple-500 bg-white shadow-md hover:shadow-lg transition-all font-medium"
      {...props}
    />
    {error && <span className="text-xs text-red-600 font-semibold">{error}</span>}
  </label>
));

Input.displayName = 'Input';

export default Input;
