import { useState } from 'react';
import { students } from './students';
import { submit } from './submit';
import { matchFilesToStudents } from './matching';
import { MOCK_FILES } from './mockFiles';
import type { FileMappingEntry, MappingField, RawFile, Step } from './types';
import WizardHeader from './components/WizardHeader';
import WizardFooter from './components/WizardFooter';
import UploadStep from './components/UploadStep';
import MappingStep from './components/MappingStep';
import styles from './App.module.css';

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [mappingField, setMappingField] = useState<MappingField | null>(null);
  const [rawFiles, setRawFiles] = useState<RawFile[]>([]);
  const [mappedFiles, setMappedFiles] = useState<FileMappingEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  const handleFilesAdded = (fileList: FileList)=>  {
    const incoming: RawFile[] = Array.from(fileList).map((f, i) => ({
      id: `file-${i}`,
      fileName: f.name,
      fileType: f.type || 'application/octet-stream',
      size: f.size,
    }));
    setRawFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.fileName));
      return [...prev, ...incoming.filter((f) => !existingNames.has(f.fileName))];
    });
  }

  const handleFileRemove = (id: string)=> {
    setRawFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const handleUseMockFiles = () => {
    setRawFiles(MOCK_FILES);
  }

  const handleNext = () => {
    if (!mappingField) return;
    const matched = matchFilesToStudents(rawFiles, mappingField, students);
    setMappedFiles(matched);
    setStep(2);
  }

  const handleBack = () => {
    setStep(1);
    setSubmitSuccess(null);
  }

  const handleCancel = () => {
    setStep(1);
    setMappingField(null);
    setRawFiles([]);
    setMappedFiles([]);
    setSearchQuery('');
    setSubmitSuccess(null);
  }

  const handleStudentChange = (fileId: string, studentId: string) => {
    setMappedFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, mappedStudentId: studentId, matchStatus: 'matched', isEditingMatch: false }
          : f
      )
    );
  }

  const handleEditMatch = (fileId: string) => {
    setMappedFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, isEditingMatch: true } : f
      )
    );
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    const result = await submit(
      mappedFiles.map((f) => ({
        studentID: f.mappedStudentId!,
        fileName: f.fileName,
        fileContentType: f.fileType,
      }))
    );
    setIsSubmitting(false);
    if (result) {
      handleCancel();
    } else {
      setSubmitSuccess(false);
    }
  }

  const nextDisabled = !mappingField || rawFiles.length === 0;
  const allMapped =
    mappedFiles.length > 0 && mappedFiles.every((f) => f.mappedStudentId !== null);

  const nextLabel = step === 1 ? 'Next' : 'Confirm & Upload';

  return (
    <div className={styles.page}>
      <div className={styles.wizard}>
        <WizardHeader
          title={step === 1 ? 'Upload Files' : 'File Name Mapping'}
          subtitle="Advanced Bulk Upload"
        />

        {step === 1 && (
          <UploadStep
            mappingField={mappingField}
            onMappingFieldChange={setMappingField}
            files={rawFiles}
            onFilesAdded={handleFilesAdded}
            onFileRemove={handleFileRemove}
            onUseMockFiles={handleUseMockFiles}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {step === 2 && (
          <MappingStep
            files={mappedFiles}
            onStudentChange={handleStudentChange}
            onEditMatch={handleEditMatch}
          />
        )}

        {submitSuccess === false && (
          <p className={styles.errorMsg}>
            Upload failed. Please try again.
          </p>
        )}

        <WizardFooter
          onCancel={handleCancel}
          onBack={step === 2 ? handleBack : undefined}
          onNext={step === 1 ? handleNext : handleSubmit}
          nextLabel={nextLabel}
          nextDisabled={step === 1 ? nextDisabled : !allMapped}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}