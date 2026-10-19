import styles from './Field.module.css';
import { fieldA11yProps } from './fieldA11y';
import { FieldMessages } from './FieldMessages';

interface RadioGroupProps {
  /** The first option receives this id so focus management can target the group. */
  id: string;
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  value: string;
  hint?: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function RadioGroup({
  id,
  name,
  legend,
  options,
  value,
  hint,
  error,
  onChange,
  onBlur,
}: RadioGroupProps) {
  const a11y = fieldA11yProps(id, { hint, error });

  return (
    <fieldset className={styles.field} aria-describedby={a11y['aria-describedby']}>
      <legend className={styles.label}>{legend}</legend>
      <div className={styles.radioList}>
        {options.map((option, index) => {
          const optionId = index === 0 ? id : `${id}-${option.value}`;
          return (
            <label key={option.value} htmlFor={optionId} className={styles.radioOption}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                className={styles.radio}
                aria-invalid={a11y['aria-invalid']}
                onChange={() => onChange(option.value)}
                onBlur={onBlur}
              />
              {option.label}
            </label>
          );
        })}
      </div>
      <FieldMessages id={id} hint={hint} error={error} />
    </fieldset>
  );
}
