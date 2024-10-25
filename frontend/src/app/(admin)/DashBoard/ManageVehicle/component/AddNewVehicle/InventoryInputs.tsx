import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import styles from './inventoryInputs.module.css';

interface FormValues {
  id?: string;
  key: string;
  model: string;
  image: (File | undefined)[];
  name: string;
  price: number;
  description: string;
  quantity: number;
}

interface InventoryProps {
  control: any;
  setValue: (name: keyof FormValues, value: any) => void; // Add setValue prop
  onSubmit: (data: any) => void;
  onBack: () => void;
  selectedVehicleImage?: string;
  errors: any; // Add errors prop
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const InventoryInputs: React.FC<InventoryProps> = ({ control, setValue, onSubmit, onBack, errors }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<File[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFileList((prevList) => [...prevList, ...newFiles]);

      // Automatically set preview for the first new file added
      const previewUrl = await getBase64(newFiles[0]);
      setPreviewImage(previewUrl);
      setPreviewTitle(newFiles[0].name);

      // Update the form state with the new files using setValue
      setValue('image', [...fileList, ...newFiles]);
    }
  };

  const handlePreview = async (file: File) => {
    const previewUrl = await getBase64(file);
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
    setPreviewTitle(file.name);
  };

  const handleRemove = (fileName: string) => {
    const updatedList = fileList.filter(file => file.name !== fileName);
    setFileList(updatedList);
    setValue('image', updatedList); // Update form state to remove the deleted image

    if (updatedList.length === 0) {
      setPreviewImage('');
      setPreviewTitle('');
      setPreviewOpen(false);
    }
  };

  useEffect(() => {
    console.log(previewImage, 'here the preview image');
  }, [previewImage]);

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item label="Quantity" required>
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <Input type="number" {...field} placeholder="Enter quantity" />
          )}
          rules={{ required: "Quantity is required." }}
        />
        {errors.quantity && <p className={styles.errorText}>{errors.quantity.message}</p>}
      </Form.Item>

      <Form.Item label="Upload Images" required>
        <Controller
          name="image"
          control={control}
          rules={{
            validate: (value) => {
              if (!value || value.length === 0) {
                return "At least one image is required.";
              }
              return true; // Validation passed
            },
          }}
          render={({ field }) => (
            <div>
              <div className={styles.imagePreviewContainer}>
                {fileList.map(file => (
                  <div
                    key={file.name}
                    className={styles.imagePreview}
                    onClick={() => handlePreview(file)}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <button
                      className={styles.removeIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(file.name);
                      }}
                    >
                      <i className="fa-solid fa-trash-arrow-up"></i>
                    </button>
                  </div>
                ))}
                <div className={styles.uploadBox}>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    multiple
                    onChange={(e) => {
                      handleFileChange(e);
                      field.onChange(fileList); // Update field value when files change
                    }}
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className={styles.uploadLabel}>
                    Click or Drag files to this area to upload
                  </label>
                </div>
              </div>
              {/* Show error message for images */}
              {errors.images && <p className={styles.errorText}>{errors.images.message}</p>}
            </div>
          )}
        />
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Form.Item>

      <Form.Item>
        <Button onClick={onBack} style={{ marginRight: 8 }}>
          Back
        </Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InventoryInputs;
