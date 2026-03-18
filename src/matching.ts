import type { Student } from './students';
import { MatchStatus, type FileMappingEntry, type MappingField, type RawFile } from './types';

export function normalizeForMatch(str: string): string {
  return str.toLowerCase().trim();
}

export function matchFilesToStudents(
  files: RawFile[],
  field: MappingField,
  students: Student[]
): FileMappingEntry[] {
  return files.map((file) => {
    const baseName = file.fileName.replace(/\.[^/.]+$/, '').trim();
    const normalizedBase = normalizeForMatch(baseName);

    const candidates = students.filter((student) => {
      const fieldValue = normalizeForMatch(student[field]);
      return (
        normalizedBase.includes(fieldValue) ||
        fieldValue.includes(normalizedBase)
      );
    });

    const matchStatus =
      candidates.length === 1
        ? MatchStatus.Matched
        : candidates.length === 0
          ? MatchStatus.NoMatch
          : MatchStatus.MultipleMatches;

    return {
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      matchStatus,
      mappedStudentId: matchStatus === MatchStatus.Matched ? candidates[0].id : null,
      candidates,
      isEditingMatch: false,
    };
  });
}