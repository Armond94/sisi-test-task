import { useRef, useState } from 'react';
import { CloudUpload, File, Search, X } from 'lucide-react';
import type { MappingField, RawFile } from '../types';
import { MOCK_FILES } from '../mockFiles';
import styles from './UploadStep.module.css';
import CustomSelect from './CustomSelect';

type Props = {
  mappingField: MappingField | null;
  onMappingFieldChange: (field: MappingField) => void;
  files: RawFile[];
  onFilesAdded: (fileList: FileList) => void;
  onFileRemove: (id: string) => void;
  onUseMockFiles: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

const FIELD_OPTIONS: { value: MappingField; label: string }[] = [
  { value: 'id', label: 'Portal ID' },
  { value: 'name', label: 'Name' },
  { value: 'studentID', label: 'Student ID' },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileSizeLabel(file: RawFile): string {
  // For mock files we don't have actual size, show type instead
  if (file.id.startsWith('mock-')) {
    const ext = file.fileName.split('.').pop()?.toUpperCase() ?? 'FILE';
    return ext;
  }
  return file.size != null ? formatFileSize(file.size) : '—';
}

export default function UploadStep({
  mappingField,
  onMappingFieldChange,
  files,
  onFilesAdded,
  onFileRemove,
  onUseMockFiles,
  searchQuery,
  onSearchChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const filtered = files.filter((f) =>
    f.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(e.target.files);
      // Reset so the same files can be re-added if removed
      e.target.value = '';
    }
  }

  return (
    <div className={styles.body}>
      {/* Map File Name to Field */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="mapping-field">
          Map File Name to Field
        </label>
        <CustomSelect
          id="mapping-field"
          options={FIELD_OPTIONS}
          value={mappingField}
          onChange={onMappingFieldChange}
          placeholder="Select"
        />
      </div>

      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${isDragOver ? styles.dropZoneDragOver : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload files"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.xlsx"
          className={styles.hiddenInput}
          onChange={handleInputChange}
        />
        <CloudUpload size={40} className={styles.uploadIcon} />
        <p className={styles.dropZoneTitle}>File Upload</p>
        <p className={styles.dropZoneSubtitle}>
          Drag &amp; drop your files here or click to browse
        </p>
        <p className={styles.dropZoneHint}>PDF, DOCX, XLSX only</p>
      </div>

      {/* Mock files link */}
      <p className={styles.mockLink}>
        If no files?{' '}
        <button
          type="button"
          className={styles.mockBtn}
          onClick={(e) => {
            e.stopPropagation();
            onUseMockFiles();
          }}
        >
          Use {MOCK_FILES.length} sample files
        </button>
      </p>

      {/* Files list */}
      <div className={styles.filesSection}>
        <p className={styles.filesTitle}>Files ({files.length})</p>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {filtered.length > 0 && (
          <ul className={styles.fileList}>
            {filtered.map((file) => (
              <li key={file.id} className={styles.fileRow}>
                <div className={styles.fileIcon}>
                  <File size={18} />
                </div>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.fileName}</span>
                  <span className={styles.fileSize}>{getFileSizeLabel(file)}</span>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => onFileRemove(file.id)}
                  aria-label={`Remove ${file.fileName}`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {files.length > 0 && filtered.length === 0 && (
          <p className={styles.emptySearch}>No files match "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
}