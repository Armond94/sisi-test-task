import type { Student } from './students';
import type { FileMappingEntry, MappingField, RawFile } from './types';

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
        ? 'matched'
        : candidates.length === 0
          ? 'no-match'
          : 'multiple-matches';

    return {
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      matchStatus,
      mappedStudentId: matchStatus === 'matched' ? candidates[0].id : null,
      candidates,
      isEditingMatch: false,
    };
  });
}