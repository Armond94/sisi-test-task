import { Loader2 } from 'lucide-react';
import styles from './WizardFooter.module.css';

type Props = {
  onCancel: () => void;
  onBack: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  isLoading?: boolean;
};

export default function WizardFooterConfirm({
  onCancel,
  onBack,
  onSubmit,
  submitDisabled,
  isLoading = false,
}: Props) {
  return (
    <div className={styles.footer}>
      <button className={styles.cancelBtn} onClick={onCancel} type="button">
        Cancel
      </button>
      <div className={styles.right}>
        <button className={styles.backBtn} onClick={onBack} type="button">
          Back
        </button>
        <button
          className={styles.nextBtn}
          onClick={onSubmit}
          disabled={submitDisabled || isLoading}
          type="button"
        >
          {isLoading && <Loader2 size={18} className={styles.spinner} />}
          Confirm & Upload
        </button>
      </div>
    </div>
  );
}