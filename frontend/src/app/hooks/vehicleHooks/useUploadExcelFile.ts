import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { UPLOAD_EXCEL_MUTATION } from '../../Services/graphql/mutations/vehicelModelMutation';

interface ErrorRow {
  rowIndex: number;
  errorMessage: string;
}

interface UploadResponse {
  success: boolean;
  errorRows: ErrorRow[];
  file?: string;  // Base64 encoded string for error file
  filename?: string; // Optional filename for error file
}

export const useUploadExcelFile = () => {
  const [uploadExcel, { loading, error }] = useMutation<{ uploadModelRegistryExcel: UploadResponse }>(
    UPLOAD_EXCEL_MUTATION,
    { client: apolloClient }
  );

  const uploadExcelFile = async (file: File) => {
    try {
      const { data } = await uploadExcel({
        variables: { file },
      });

      // Ensure data is not null or undefined
      if (data?.uploadModelRegistryExcel) {
        const { success, errorRows, file: errorFile, filename } = data.uploadModelRegistryExcel;

        if (!success) {
          // Build the error message from the errorRows
          const errorMessage = errorRows.length > 0 
            ? `File upload failed. Errors: ${errorRows.map(row => `Row ${row.rowIndex}: ${row.errorMessage}`).join(', ')}`
            : 'File upload failed. No specific errors provided.';

          // Optionally, you can handle the error file here
          if (errorFile && filename) {
            const byteCharacters = atob(errorFile);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename; // Use the filename returned from the backend
            link.click();
          }

          // throw new Error(errorMessage); // Throw error with the constructed message
        }

        return data.uploadModelRegistryExcel; // Return the successful response
      } else {
        throw new Error('File upload failed. No response from server.');
      }
    } catch (err) {
      console.error("Error uploading Excel file:", err);
      throw new Error("Failed to upload Excel file.");
    }
  };

  return {
    uploadExcelFile,
    loading,
    error,
  };
};
