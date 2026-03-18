import type { Student } from './students';

export type MappingField = 'id' | 'name' | 'studentID';

export type MatchStatus = 'matched' | 'no-match' | 'multiple-matches';

export type Step = 1 | 2;

export type RawFile = {
  id: string;
  fileName: string;
  fileType: string;
  size?: number;
};

export type FileMappingEntry = {
  id: string;
  fileName: string;
  fileType: string;
  matchStatus: MatchStatus;
  mappedStudentId: string | null;
  candidates: Student[];
  isEditingMatch: boolean;
};