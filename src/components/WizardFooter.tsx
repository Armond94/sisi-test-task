import { ArrowRight, Loader2 } from 'lucide-react';
import styles from './WizardFooter.module.css';

type Props = {
  onCancel: () => void;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled: boolean;
  isLoading?: boolean;
};

export default function WizardFooter({
  onCancel,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  isLoading = false,
}: Props) {
  return (
    <div className={styles.footer}>
      <button className={styles.cancelBtn} onClick={onCancel} type="button">
        Cancel
      </button>
      <div className={styles.right}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack} type="button">
            Back
          </button>
        )}
        <button
          className={styles.nextBtn}
          onClick={onNext}
          disabled={nextDisabled || isLoading}
          type="button"
        >
          {isLoading ? (
            <Loader2 size={18} className={styles.spinner} />
          ) : null}
          {nextLabel}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}