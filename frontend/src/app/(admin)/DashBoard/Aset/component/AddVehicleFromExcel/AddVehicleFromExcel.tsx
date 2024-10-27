import React, { useState } from "react";
import { useUploadExcelFile } from "@/app/hooks/vehicleHooks/useUploadExcelFile"; // Custom hook for file upload
import styles from "./addVehicleFromExcel.module.css";

interface MyProps {
  isAddVehicleFromExcelOpen: boolean;
  onCancel: () => void;
}

const AddVehicleFromExcel: React.FC<MyProps> = ({ isAddVehicleFromExcelOpen, onCancel }) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const { uploadExcelFile, loading, error } = useUploadExcelFile(); // Use the mutation hook

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFileList(files);
    }
  };

  const onSubmit = async () => {
    if (fileList.length === 0) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    fileList.forEach(file => {
        formData.append('file', file);
    });

    try {
        const response = await uploadExcelFile(fileList[0]);
        if (response.success) {
            alert('File uploaded successfully');
        } else if (response.file && response.filename) {
            const blob = new Blob([response.file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = response.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('File processed with errors. Please check the downloaded error report.');
        }
    } catch (err) {
        console.error("Error uploading file:", err);
        alert('File upload failed.');
    }

    setFileList([]);
    onCancel();
};


  const onHandleCancel = () => {
    setFileList([]);
    onCancel();
  };

  const beforeUpload = (file: File) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      alert('You can only upload Excel files!');
    }
    return isExcel;
  };

  return (
    isAddVehicleFromExcelOpen && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Add New From Excel</h2>

          <div className={styles.downloadSection}>
            <button
              className={`${styles.button} ${styles.downloadButton}`}
              onClick={() => window.location.href = '/sample_vehicle_data.xlsx'}
            >
              Download Sample Excel File
            </button>
          </div>

          <div className={styles.fileInput}>
            <label className={styles.label}>Upload File</label>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className={styles.input}
            />
          </div>

          {fileList.length > 0 && (
            <div className={styles.fileList}>
              <p className={styles.fileNames}>Files selected: {fileList.map(file => file.name).join(', ')}</p>
            </div>
          )}

          {loading && <p>Uploading...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

          <div className={styles.buttonGroup}>
            <button
              onClick={onHandleCancel}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className={`${styles.button} ${styles.submitButton}`}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddVehicleFromExcel;
