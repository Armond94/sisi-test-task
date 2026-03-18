import type { Student } from './students';

export type MappingField = 'id' | 'name' | 'studentID';

// Becasue of this erasableSyntaxOnly
export const MatchStatus = {
  Matched: 'matched',
  NoMatch: 'no-match',
  MultipleMatches: 'multiple-matches',
} as const;

export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];

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