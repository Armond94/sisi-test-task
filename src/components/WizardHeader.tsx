import { X } from 'lucide-react';
import styles from './WizardHeader.module.css';

type Props = {
  title: string;
  subtitle: string;
};

export default function WizardHeader({ title, subtitle }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <button className={styles.closeBtn} aria-label="Close">
        <X size={20} />
      </button>
    </div>
  );
}