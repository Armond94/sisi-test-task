import { Pencil } from 'lucide-react';
import { students } from '../students';
import { MatchStatus, type FileMappingEntry } from '../types';
import styles from './MappedToControl.module.css';
import CustomSelect, { type SelectGroup } from './CustomSelect';

type Props = {
  entry: FileMappingEntry;
  onStudentChange: (fileId: string, studentId: string) => void;
  onEditMatch: (fileId: string) => void;
};

export default function MappedToControl({ entry, onStudentChange, onEditMatch }: Props) {
  const { id, matchStatus, mappedStudentId, candidates, isEditingMatch } = entry;

  const mappedStudent = mappedStudentId
    ? students.find((s) => s.id === mappedStudentId)
    : null;

  // Matched + not in edit mode → show inline card
  if (matchStatus === MatchStatus.Matched && !isEditingMatch) {
    return (
      <div className={styles.matchedCard}>
        {mappedStudent && (
          <img
            src={mappedStudent.imageURL}
            alt={mappedStudent.name}
            className={styles.avatar}
          />
        )}
        <div className={styles.studentInfo}>
          <span className={styles.studentName}>{mappedStudent?.name ?? '—'}</span>
          <span className={styles.studentGrade}>{mappedStudent?.grade ?? ''}</span>
        </div>
        <button
          type="button"
          className={styles.editBtn}
          onClick={() => onEditMatch(id)}
          aria-label="Change student"
        >
          <Pencil size={15} />
        </button>
      </div>
    );
  }

  const candidateIds = new Set(candidates.map((s) => s.id));
  const remaining = students.filter((s) => !candidateIds.has(s.id));
  const hasGroups = matchStatus === MatchStatus.MultipleMatches && candidates.length > 0;

  const placeholder =
    matchStatus === MatchStatus.NoMatch
      ? 'No Match Found'
      : matchStatus === MatchStatus.MultipleMatches
        ? 'Multiple Matches Found'
        : 'Select student…';

  const variant =
    matchStatus === MatchStatus.NoMatch
      ? 'no-match'
      : matchStatus === MatchStatus.MultipleMatches
        ? 'multiple-matches'
        : 'default';

  function toOption(s: { id: string; name: string; studentID: string; grade: string }) {
    return { value: s.id, label: `${s.name} — ${s.studentID} (${s.grade})` };
  }

  const groups: SelectGroup<string>[] | undefined = hasGroups
    ? [
        { label: 'Potential matches', options: candidates.map(toOption) },
        { label: 'All students', options: remaining.map(toOption) },
      ]
    : undefined;

  return (
    <CustomSelect
      options={groups ? undefined : students.map(toOption)}
      groups={groups}
      value={mappedStudentId ?? null}
      onChange={(studentId) => onStudentChange(id, studentId)}
      placeholder={placeholder}
      variant={variant}
    />
  );
}
