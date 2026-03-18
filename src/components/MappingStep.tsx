import { ArrowRight, File } from 'lucide-react';
import type { FileMappingEntry } from '../types';
import MappedToControl from './MappedToControl';
import styles from './MappingStep.module.css';

type Props = {
  files: FileMappingEntry[];
  onStudentChange: (fileId: string, studentId: string) => void;
  onEditMatch: (fileId: string) => void;
};

function getFileExtLabel(fileName: string): string {
  const ext = fileName.split('.').pop()?.toUpperCase() ?? 'FILE';
  return ext;
}

export default function MappingStep({ files, onStudentChange, onEditMatch }: Props) {
  return (
    <div className={styles.body}>
<div className={styles.columnHeaders}>
        <span className={styles.colFile}>File Name</span>
        <span className={styles.colMapped}>Mapped to</span>
      </div>

      <ul className={styles.list}>
        {files.map((entry) => (
          <li key={entry.id} className={styles.row}>
            <div className={styles.fileCell}>
              <div className={styles.fileIcon}>
                <File size={18} />
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName} title={entry.fileName}>
                  {entry.fileName}
                </span>
                <span className={styles.fileExt}>{getFileExtLabel(entry.fileName)}</span>
              </div>
            </div>

            <ArrowRight size={16} className={styles.arrow} />

            <div className={styles.mappedCell}>
              <MappedToControl
                entry={entry}
                onStudentChange={onStudentChange}
                onEditMatch={onEditMatch}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}