const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\olive\\.gemini\\antigravity\\scratch\\asaia';

const files = {
  'src/components/ui/Badge.tsx': `import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    error: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    brand: 'bg-brand-600 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            variant === 'default' && 'bg-gray-400 dark:bg-slate-500',
            variant === 'success' && 'bg-brand-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'error' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'brand' && 'bg-white'
          )}
        />
      )}
      {children}
    </span>
  );
}
`,

  'src/components/ui/Button.tsx': `import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm',
      secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200',
      ghost: 'hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-600 dark:text-slate-400',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      outline: 'border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 bg-transparent',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className={cn('animate-spin', children ? 'mr-2 h-4 w-4' : 'h-5 w-5')} />}
        {!loading && icon && <span className={cn('flex items-center', children ? 'mr-2' : '')}>{icon}</span>}
        {children}
        {!loading && iconRight && <span className={cn('flex items-center', children ? 'ml-2' : '')}>{iconRight}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
`,

  'src/components/ui/Input.tsx': `import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, hint, iconLeft, iconRight, id, ...props },
    ref
  ) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-3 text-gray-400 flex items-center justify-center pointer-events-none">
              {iconLeft}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 text-gray-400 flex items-center justify-center pointer-events-none">
              {iconRight}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500 dark:text-slate-400">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
`,

  'src/components/ui/Textarea.tsx': `import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, hint, id, ...props },
    ref
  ) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500 dark:text-slate-400">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
`,

  'src/components/ui/Select.tsx': `import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, options, value, onChange, placeholder, id, ...props },
    ref
  ) => {
    const selectId = id || Math.random().toString(36).substring(7);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              'flex h-10 w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors pr-10',
              error && 'border-red-500 focus:ring-red-500',
              !value && placeholder && 'text-gray-500 dark:text-slate-400',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="hidden">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
`,

  'src/components/ui/Modal.tsx': `import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full flex flex-col max-h-[90vh]',
              sizes[size]
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-slate-700">
              <div>
                {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h2>}
                {description && <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{description}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full -mt-1 -mr-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {children}
            </div>

            {footer && (
              <div className="p-6 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 rounded-b-2xl flex justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}
`,

  'src/components/ui/Drawer.tsx': `import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

export function Drawer({ open, onClose, title, children, width = 'md' }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'relative bg-white dark:bg-slate-800 w-full h-full shadow-2xl flex flex-col',
              widths[width]
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
              {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h2>}
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}
`,

  'src/components/ui/Toast.tsx': `import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={cn(
                  'flex items-center gap-3 min-w-[300px] p-4 rounded-xl shadow-lg border',
                  toast.type === 'success' && 'bg-white dark:bg-slate-800 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-400',
                  toast.type === 'error' && 'bg-white dark:bg-slate-800 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-400',
                  toast.type === 'warning' && 'bg-white dark:bg-slate-800 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400',
                  toast.type === 'info' && 'bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-400'
                )}
              >
                {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                
                <p className="flex-1 text-sm font-medium">{toast.message}</p>
                
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
`,

  'src/components/ui/Skeleton.tsx': `import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse',
              i === lines - 1 && 'w-2/3',
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('h-4 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse', className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full">
      <div className="border-b border-gray-100 dark:border-slate-700 pb-4 mb-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}
`,

  'src/components/ui/Avatar.tsx': `import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export function Avatar({ name, src, size = 'md', status, className }: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-brand-600 text-white font-medium overflow-hidden border border-brand-700/20',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-800',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
`,

  'src/components/ui/Tabs.tsx': `import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  variant?: 'line' | 'pill';
  className?: string;
}

export function Tabs({ tabs, active, onChange, variant = 'line', className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex',
        variant === 'line' ? 'border-b border-gray-200 dark:border-slate-700 gap-6' : 'gap-2',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        if (variant === 'pill') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2',
                isActive
                  ? 'text-white bg-brand-600'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-slate-200 dark:hover:bg-slate-800'
              )}
            >
              {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-1.5 py-0.5 px-2 rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-brand-500/50 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        }

        // Line variant
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative pb-3 text-sm font-medium transition-colors flex items-center gap-2',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            )}
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1.5 py-0.5 px-2 rounded-full text-xs font-semibold',
                  isActive
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
`,

  'src/components/ui/Table.tsx': `import React from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b dark:[&_tr]:border-slate-700', className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-b border-gray-100 dark:border-slate-700 transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-700/50 data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-slate-700',
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-slate-400 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0 text-gray-900 dark:text-slate-300', className)}
      {...props}
    />
  );
}
`,

  'src/components/ui/EmptyState.tsx': `import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-slate-800/50 mb-4 text-gray-400 dark:text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
`,

  'src/components/ui/StatusBadge.tsx': `import React from 'react';
import { Badge } from './Badge';

export type TicketStatus = 'aberto' | 'em_atendimento' | 'aguardando_aluno' | 'resolvido' | 'fechado';

export interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    aberto: { variant: 'info' as const, label: 'Aberto' },
    em_atendimento: { variant: 'warning' as const, label: 'Em atendimento' },
    aguardando_aluno: { variant: 'default' as const, label: 'Aguardando aluno', extraClass: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
    resolvido: { variant: 'success' as const, label: 'Resolvido' },
    fechado: { variant: 'default' as const, label: 'Fechado' },
  };

  const { variant, label, extraClass } = config[status];

  return (
    <Badge variant={variant} className={extraClass ? extraClass : className} dot>
      {label}
    </Badge>
  );
}
`,

  'src/components/ui/PriorityBadge.tsx': `import React from 'react';
import { Badge } from './Badge';
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

export type Priority = 'baixa' | 'media' | 'alta' | 'critica';

export interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  const config = {
    critica: { variant: 'error' as const, label: 'Crítica', icon: AlertTriangle },
    alta: { variant: 'warning' as const, label: 'Alta', icon: ArrowUp, extraClass: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
    media: { variant: 'warning' as const, label: 'Média', icon: Minus },
    baixa: { variant: 'default' as const, label: 'Baixa', icon: ArrowDown },
  };

  const { variant, label, icon: Icon, extraClass } = config[priority];

  return (
    <Badge variant={variant} className={extraClass ? extraClass : className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {label}
    </Badge>
  );
}
`,

  'src/components/ui/SLAIndicator.tsx': `import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SLAIndicatorProps {
  deadline: string;
  status: 'ok' | 'risk' | 'breached';
  className?: string;
}

export function SLAIndicator({ deadline, status, className }: SLAIndicatorProps) {
  // In a real app, calculate time remaining from deadline.
  // Using a mock string based on status for now.
  const timeRemaining = status === 'ok' ? '4h 30m' : status === 'risk' ? '15m' : 'Vencido';

  const config = {
    ok: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
    risk: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 animate-pulse',
    breached: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 font-bold',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium', config[status], className)}>
      <Clock className="h-3 w-3" />
      <span>{timeRemaining}</span>
      {status === 'risk' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping ml-1" />}
    </div>
  );
}
`,

  'src/components/layout/Header.tsx': `import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown, User, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { NotificationPanel } from './NotificationPanel';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  showSearch?: boolean;
}

export function Header({ title, breadcrumbs, showSearch = false }: HeaderProps) {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        {breadcrumbs ? (
          <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-2 text-gray-300 dark:text-slate-600">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-slate-100' : ''}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h1>
        )}

        {showSearch && (
          <div className="ml-8 max-w-md w-full hidden md:block">
            <Input
              placeholder="Buscar chamados, alunos, artigos..."
              iconLeft={<Search className="h-4 w-4" />}
              className="bg-gray-50 dark:bg-slate-800 border-transparent focus:bg-white"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-full relative" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
          </Button>
          {showNotifications && (
            <div className="absolute right-0 mt-2">
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1" />

        <div className="relative">
          <button 
            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
            onClick={() => setShowProfile(!showProfile)}
          >
            <Avatar name="Admin User" size="sm" />
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-2">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 mb-2">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">admin@asaia.edu.br</p>
              </div>
              
              <div className="px-2">
                <button className="w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300">
                  <User className="h-4 w-4" /> Perfil
                </button>
                
                <div className="my-2 border-t border-gray-100 dark:border-slate-700" />
                <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Alternar Papel</p>
                
                <button onClick={() => { navigate('/aluno'); setShowProfile(false); }} className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300">
                  Visão Aluno
                </button>
                <button onClick={() => { navigate('/asa'); setShowProfile(false); }} className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300">
                  Visão ASA
                </button>
                <button onClick={() => { navigate('/admin'); setShowProfile(false); }} className="w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-brand-600 dark:text-brand-400 font-medium bg-brand-50 dark:bg-brand-900/10">
                  <Shield className="h-4 w-4" /> Visão Admin
                </button>
                
                <div className="my-2 border-t border-gray-100 dark:border-slate-700" />
                <button className="w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400">
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
`,

  'src/components/layout/NotificationPanel.tsx': `import React from 'react';
import { Check, Info, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock data
const mockNotifications = [
  { id: '1', title: 'Chamado #1024 resolvido', message: 'Seu problema com o boleto foi resolvido.', time: 'Há 5 min', type: 'success', unread: true },
  { id: '2', title: 'Nova mensagem', message: 'O atendente Carlos respondeu ao seu chamado.', time: 'Há 1 hora', type: 'message', unread: true },
  { id: '3', title: 'Aviso do sistema', message: 'Manutenção programada para o fim de semana.', time: 'Há 2 dias', type: 'info', unread: false },
];

export function NotificationPanel({ onClose }: { onClose?: () => void }) {
  return (
    <div className="w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col z-50">
      <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100">Notificações</h3>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
          Marcar como lidas
        </Button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {mockNotifications.length > 0 ? (
          <div className="flex flex-col">
            {mockNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={\`p-4 border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors flex gap-3 relative \${notif.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}\`}
              >
                {notif.unread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
                )}
                
                <div className="mt-0.5">
                  {notif.type === 'success' && <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center"><Check className="h-4 w-4" /></div>}
                  {notif.type === 'message' && <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><MessageSquare className="h-4 w-4" /></div>}
                  {notif.type === 'info' && <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 flex items-center justify-center"><Info className="h-4 w-4" /></div>}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-0.5">{notif.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 leading-snug">{notif.message}</p>
                  <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            Nenhuma notificação no momento.
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
        <Button variant="ghost" className="w-full text-sm font-medium text-brand-600 dark:text-brand-400">
          Ver todas as notificações
        </Button>
      </div>
    </div>
  );
}
`,

  'src/components/layout/AlunoLayout.tsx': `import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, MessageSquare, Ticket, User } from 'lucide-react';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export function AlunoLayout() {
  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/aluno' },
    { label: 'Chat IA', icon: MessageSquare, path: '/aluno/chat' },
    { label: 'Meus Chamados', icon: Ticket, path: '/aluno/chamados' },
    { label: 'Perfil', icon: User, path: '/aluno/perfil' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col z-10 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-500">
            <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight">ASAIA</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/aluno'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex justify-around p-2 z-50 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/aluno'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center p-2 rounded-lg text-[10px] font-medium gap-1',
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-gray-500 dark:text-slate-400'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
`,

  'src/components/layout/AsaLayout.tsx': `import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  Home, Ticket, ListTodo, MessageSquare, Users, 
  Bot, BookOpen, Clock, BarChart2, Bell, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

export function AsaLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const navGroups = [
    {
      label: 'Principal',
      items: [
        { label: 'Dashboard', icon: Home, path: '/asa' },
        { label: 'Meus Chamados', icon: Ticket, path: '/asa/chamados', count: 12 },
      ]
    },
    {
      label: 'Atendimento',
      items: [
        { label: 'Fila', icon: ListTodo, path: '/asa/fila' },
        { label: 'Conversas', icon: MessageSquare, path: '/asa/conversas' },
      ]
    },
    {
      label: 'Alunos',
      items: [
        { label: 'Diretório', icon: Users, path: '/asa/alunos' },
      ]
    },
    {
      label: 'Inteligência',
      items: [
        { label: 'Agente IA', icon: Bot, path: '/asa/ia' },
        { label: 'Base de Conhecimento', icon: BookOpen, path: '/asa/base' },
      ]
    },
    {
      label: 'Operação',
      items: [
        { label: 'SLA', icon: Clock, path: '/asa/sla' },
        { label: 'Relatórios', icon: BarChart2, path: '/asa/relatorios' },
      ]
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <aside 
        className={cn(
          "bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col z-10 transition-all duration-300 relative hidden md:flex",
          collapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full p-1 z-20 text-gray-500 hover:text-brand-600 shadow-sm"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-500">
            <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl leading-none">A</span>
            </div>
            {!collapsed && <span className="font-bold text-xl tracking-tight truncate">ASAIA</span>}
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden px-3">
          <TooltipProvider delayDuration={0}>
            {navGroups.map((group, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                {!collapsed && (
                  <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group.label}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Tooltip key={item.path}>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={item.path}
                          end={item.path === '/asa'}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
                              collapsed ? 'justify-center' : '',
                              isActive
                                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                            )
                          }
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.count && (
                                <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 py-0.5 px-2 rounded-full text-xs">
                                  {item.count}
                                </span>
                              )}
                            </>
                          )}
                          {collapsed && item.count && (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500" />
                          )}
                        </NavLink>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className="bg-slate-800 text-white text-xs py-1 px-2 rounded z-50 ml-2">
                          {item.label} {item.count ? \`(\${item.count})\` : ''}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </TooltipProvider>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <Header showSearch breadcrumbs={[{label: 'ASA'}, {label: 'Dashboard'}]} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
`,

  'src/components/layout/AdminLayout.tsx': `import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Ticket, ListTodo, Clock, Tags, Zap,
  Bot, Terminal, BookOpen, Database, MessageSquareWarning,
  Users, UserSquare2, GraduationCap, ShieldAlert,
  Mail, Link2, BarChart3, PieChart, ShieldCheck, Activity, Settings
} from 'lucide-react';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const navGroups = [
    {
      items: [
        { label: 'Visão Geral', icon: LayoutDashboard, path: '/admin' },
      ]
    },
    {
      label: 'OPERAÇÃO',
      items: [
        { label: 'Chamados', icon: Ticket, path: '/admin/chamados' },
        { label: 'Fila', icon: ListTodo, path: '/admin/fila' },
        { label: 'SLA', icon: Clock, path: '/admin/sla' },
        { label: 'Categorias', icon: Tags, path: '/admin/categorias' },
        { label: 'Automação', icon: Zap, path: '/admin/automacao' },
      ]
    },
    {
      label: 'INTELIGÊNCIA',
      items: [
        { label: 'Agente IA', icon: Bot, path: '/admin/ia' },
        { label: 'Prompts', icon: Terminal, path: '/admin/prompts' },
        { label: 'Base de Conhecimento', icon: BookOpen, path: '/admin/base' },
        { label: 'RAG', icon: Database, path: '/admin/rag' },
        { label: 'Feedback', icon: MessageSquareWarning, path: '/admin/feedback' },
      ]
    },
    {
      label: 'GESTÃO',
      items: [
        { label: 'Usuários', icon: Users, path: '/admin/usuarios' },
        { label: 'Alunos', icon: GraduationCap, path: '/admin/alunos' },
        { label: 'ASA', icon: UserSquare2, path: '/admin/asa' },
        { label: 'Permissões', icon: ShieldAlert, path: '/admin/permissoes' },
      ]
    },
    {
      label: 'INTEGRAÇÕES',
      items: [
        { label: 'E-mail / Integrações', icon: Mail, path: '/admin/integracoes' },
        { label: 'APIs', icon: Link2, path: '/admin/apis' },
      ]
    },
    {
      label: 'ANALYTICS',
      items: [
        { label: 'Métricas', icon: BarChart3, path: '/admin/metricas' },
        { label: 'Relatórios', icon: PieChart, path: '/admin/relatorios' },
      ]
    },
    {
      label: 'GOVERNANÇA',
      items: [
        { label: 'Auditoria', icon: ShieldCheck, path: '/admin/auditoria' },
        { label: 'Logs', icon: Activity, path: '/admin/logs' },
      ]
    },
    {
      label: 'SISTEMA',
      items: [
        { label: 'Configurações', icon: Settings, path: '/admin/configs' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <aside className="w-[280px] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col z-10 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white">
            <div className="h-8 w-8 bg-slate-800 dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-xl leading-none">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Admin Console</span>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto px-4 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              {group.label && (
                <p className="px-2 mb-2 text-xs font-bold text-gray-400 dark:text-slate-500 tracking-wider">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                      )
                    }
                  >
                    <item.icon className={cn("h-4 w-4", group.label ? "opacity-70" : "")} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-slate-900">
        <Header showSearch breadcrumbs={[{label: 'Admin'}, {label: 'Visão Geral'}]} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', fullPath);
}
