import React, { useState } from "react";
import { useUploadExcelFile } from "@/app/hooks/vehicleHooks/useUploadExcelFile"; // Custom hook for file upload
import styles from "./addVehicleFromExcel.module.css";
import { message } from "antd";

interface MyProps {
  isAddVehicleFromExcelOpen: boolean;
  onCancel: () => void;
  onSubmit: Function
}

const AddVehicleFromExcel: React.FC<MyProps> = ({ isAddVehicleFromExcelOpen, onCancel, onSubmit }) => {
  const [fileList, setFileList] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFileList(files);
    }
  };

 const onHandleSubmit = () => {
      if(! beforeUpload(fileList[0])){
        return 
      }
      onSubmit(fileList, onHandleCancel)
  }
  const onHandleCancel = () => {
    setFileList([]);
    onCancel();
  };

  const beforeUpload = (file: File) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.warning({content:'You can only upload Excel files!'})
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
          <div className={styles.buttonGroup}>
            <button
              onClick={onHandleCancel}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Cancel
            </button>
            <button
              onClick={onHandleSubmit}
              className={`${styles.button} ${styles.submitButton}`}
              // disabled={loading}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddVehicleFromExcel;
