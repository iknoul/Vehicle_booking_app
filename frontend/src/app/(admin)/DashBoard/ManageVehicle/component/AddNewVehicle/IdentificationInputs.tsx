// IdentificationInputs.tsx
import React from "react";
import { Form, Input, Select, Button } from "antd";
import { Controller } from "react-hook-form";
import { useFetchVehicleModels } from "@/app/hooks/vehicleHooks/useFetchVehiclesModel";
import styles from './inventoryInputs.module.css';

interface IdentificationProps {
  control: any;
  onNext: (data: any) => void;
  errors: any; // Add errors prop
}

const IdentificationInputs: React.FC<IdentificationProps> = ({ control, onNext, errors }) => {
  
  const { vehicleModels, loading: vehiclesLoading, refetch, error: fetchError } = useFetchVehicleModels();

  return (
    <Form layout="vertical" onFinish={onNext}>
      <Form.Item label="Key" required>
        <Controller
          name="key"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter vehicle key" />
          )}
          rules={{ required: true }}
        />
        {errors.key && <p className={styles.errorText}>Key is required.</p>}
      </Form.Item>
      <Form.Item label="Model" required>
        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Select vehicle model">
              {vehicleModels?.map(model => (
                <Select.Option key={model.id} value={model.id}>
                  {model.model}
                </Select.Option>
              ))}
            </Select>
          )}
          rules={{ required: true }}
        />
        {errors.model && <p className={styles.errorText}>Model is required.</p>}
      </Form.Item>
      <Form.Item label="Name" required>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter vehicle name" />
          )}
          rules={{ required: true }}
        />
        {errors.name && <p className={styles.errorText}>Name is required.</p>}
      </Form.Item>
      <Form.Item label="Price" required>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <Input type="number" {...field} placeholder="Enter vehicle price" />
          )}
          rules={{ required: true }}
        />
        {errors.price && <p className={styles.errorText}>Price is required.</p>}
      </Form.Item>
      <Form.Item label="Description" required>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input.TextArea {...field} placeholder="Enter vehicle description" />
          )}
          rules={{ required: true }}
        />
        {errors.description && <p className={styles.errorText}>Description is required.</p>}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Next
        </Button>
      </Form.Item>
    </Form>
  );
};

export default IdentificationInputs;
