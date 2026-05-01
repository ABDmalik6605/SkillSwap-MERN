import clsx from 'clsx';

const Button = ({ children, variant = 'primary', className = '', as: Component = 'button', ...props }) => {
  const base =
    'px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-md hover:shadow-lg',
    secondary: 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300 shadow-sm',
    success: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 shadow-md hover:shadow-lg'
  };
  return (
    <Component className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </Component>
  );
};

export default Button;
