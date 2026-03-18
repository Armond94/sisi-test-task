import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import styles from './CustomSelect.module.css';

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

export type SelectGroup<T extends string> = {
  label: string;
  options: SelectOption<T>[];
};

type Props<T extends string> = {
  id?: string;
  /** Flat list of options — use this OR `groups`, not both. */
  options?: SelectOption<T>[];
  /** Grouped options — use this OR `options`, not both. */
  groups?: SelectGroup<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  /** Visual status variant for the trigger border / colour. */
  variant?: 'default' | 'no-match' | 'multiple-matches';
};

export default function CustomSelect<T extends string>({
  id,
  options,
  groups,
  value,
  onChange,
  placeholder = 'Select',
  variant = 'default',
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Flatten all options into one list for keyboard nav / selection logic
  const flatOptions: SelectOption<T>[] = groups
    ? groups.flatMap((g) => g.options)
    : (options ?? []);

  const selectedLabel = flatOptions.find((o) => o.value === value)?.label;

  const handlePointerDown = (e: PointerEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, handlePointerDown]);

  // Scroll focused option into view
  useEffect(() => {
    if (open && focusedIndex >= 0) {
      optionRefs.current[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, open, optionRefs]);

  function openDropdown() {
    setOpen(true);
    setFocusedIndex(value ? flatOptions.findIndex((o) => o.value === value) : 0);
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      openDropdown();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function selectOption(val: T) {
    onChange(val);
    setOpen(false);
    triggerRef.current?.focus();
  }

  const triggerClass = [
    styles.trigger,
    open ? styles.triggerOpen : '',
    variant === 'no-match' ? styles.triggerNoMatch : '',
    variant === 'multiple-matches' ? styles.triggerMultiMatch : '',
  ].join(' ');

  // Render flat options list
  function renderFlatOptions(opts: SelectOption<T>[], indexOffset = 0) {
    return opts.map((opt, i) => {
      const flatIndex = indexOffset + i;
      const isSelected = opt.value === value;
      const isFocused = flatIndex === focusedIndex;
      return (
        <li
          key={opt.value}
          ref={(el) => { optionRefs.current[flatIndex] = el; }}
          role="option"
          aria-selected={isSelected}
          tabIndex={isFocused ? 0 : -1}
          className={[
            styles.option,
            isSelected ? styles.optionSelected : '',
            isFocused ? styles.optionFocused : '',
          ].join(' ')}
          onPointerDown={() => selectOption(opt.value)}
          onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(Math.min(flatIndex + 1, flatOptions.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (flatIndex === 0) { setOpen(false); triggerRef.current?.focus(); }
                else setFocusedIndex(flatIndex - 1);
              } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption(opt.value);
              } else if (e.key === 'Escape' || e.key === 'Tab') {
                setOpen(false);
                triggerRef.current?.focus();
              }
            }}
          onMouseEnter={() => setFocusedIndex(flatIndex)}
        >
          {isSelected ? (
            <span className={styles.optionCheck}>
              <Check size={14} strokeWidth={2.5} />
            </span>
          ) : (
            <span className={styles.optionCheckPlaceholder} />
          )}
          {opt.label}
        </li>
      );
    });
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={triggerClass}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={`${styles.triggerValue} ${!value ? styles.triggerPlaceholder : ''}`}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          <ul className={styles.optionList}>
            {groups
              ? (() => {
                  let offset = 0;
                  return groups.map((group) => {
                    const rendered = (
                      <li key={group.label} className={styles.group}>
                        <span className={styles.groupLabel}>{group.label}</span>
                        <ul className={styles.groupOptionList}>
                          {renderFlatOptions(group.options, offset)}
                        </ul>
                      </li>
                    );
                    offset += group.options.length;
                    return rendered;
                  });
                })()
              : renderFlatOptions(flatOptions)}
          </ul>
        </div>
      )}
    </div>
  );
}