import React, { useState } from "react";
import { Modal, Button, Upload, message } from "antd"; 
import { UploadOutlined } from '@ant-design/icons';
// Import axios for sending HTTP requests if needed later
// import axios from "axios";

interface MyProps {
    isAddVehicleFromExcelOpen: boolean;
    onCancel: () => void; // Specify the type correctly
}

const AddVehicleFromExcel: React.FC<MyProps> = ({ isAddVehicleFromExcelOpen, onCancel }) => {
    const [fileList, setFileList] = useState<any[]>([]); // Manage uploaded files

    const onSubmit = async () => {
        const formData = new FormData();

        // Append the uploaded Excel files
        fileList.forEach(file => {
            formData.append('file', file.originFileObj);
        });

        try {
            // Uncomment and adjust the endpoint as necessary
            // const response = await axios.post('/your-api-endpoint', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // console.log("Response from server:", response.data);
            // Handle success (e.g., show a notification)
            message.success('Files uploaded successfully.');
        } catch (error) {
            console.error("Error uploading data:", error);
            message.error('File upload failed.');
        }

        // Clear the file list after submission
        setFileList([]);
        onCancel(); // Close the modal after submission
    };

    const onHandleCancel = () => {
        setFileList([]); // Clear uploaded files on cancel
        onCancel();
    };

    const handleChange = (info: any) => {
        const { status } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
        setFileList(info.fileList); // Update the file list
    };

    const beforeUpload = (file: File) => {
        // Validate file type
        const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                        file.type === 'application/vnd.ms-excel';
        if (!isExcel) {
            message.error('You can only upload Excel files!');
        }
        return isExcel;
    };

    return (
        <Modal 
            open={isAddVehicleFromExcelOpen} 
            okText='Submit'
            onCancel={onHandleCancel}
            onOk={onSubmit}
        >
            <Upload
                multiple={true}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={fileList}
                showUploadList={true} // Display the list of uploaded files
            >
                <Button icon={<UploadOutlined />}>Upload Excel</Button>
            </Upload>
        </Modal>
    );
};

export default AddVehicleFromExcel;
    