import { ArrowRight } from 'lucide-react';
import styles from './WizardFooter.module.css';

type Props = {
  onCancel: () => void;
  onNext: () => void;
  nextDisabled: boolean;
};

export default function WizardFooterNext({ onCancel, onNext, nextDisabled }: Props) {
  return (
    <div className={styles.footer}>
      <button className={styles.cancelBtn} onClick={onCancel} type="button">
        Cancel
      </button>
      <button
        className={styles.nextBtn}
        onClick={onNext}
        disabled={nextDisabled}
        type="button"
      >
        Next
        <ArrowRight size={18} />
      </button>
    </div>
  );
}