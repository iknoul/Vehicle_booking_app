import React, { useEffect, useState } from "react";
import { useForm, Controller, FieldError } from "react-hook-form";
import { useCreateVehicleModel } from '@/app/hooks/vehicleHooks/useCreateVehicleModel';
import { useUpdateVehicleModel } from '@/app/hooks/vehicleHooks/useUpdateVehicleModel';
import styles from './addNewModel.module.css';

interface MyProps {
  isAddVehicleOpen: boolean;
  setSuccess: Function;
  setFail: Function;
  onCancel: Function;
  vehicleData?: FormValues | null;
}

interface FormValues {
  id?: string;
  model: string;
  type: string;
  manufacture: string;
}

interface InputField {
  label: string;
  placeholder: string;
  name: keyof FormValues;
  required: boolean;
  type?: string;
}

const Types = ["SUV", "HATCH_BACK", "SEDAN"];
const inputFields: InputField[] = [
  { label: "Model Name", placeholder: "Enter the model name", name: "model", required: true },
  { label: "Manufacture Name", placeholder: "Enter the manufacture name", name: "manufacture", required: true },
];

const AddNewModel: React.FC<MyProps> = ({ isAddVehicleOpen, onCancel, vehicleData, setSuccess, setFail }) => {
  const { createNewVehicleModel } = useCreateVehicleModel();
  const { updateExistingVehicleModel } = useUpdateVehicleModel();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ defaultValues: { model: '', manufacture: '' } });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (data.id) {
        await updateExistingVehicleModel({ id: data.id, model: data.model, type: data.type, manufacture: data.manufacture });
      } else {
        await createNewVehicleModel({ model: data.model, type: data.type, manufacture: data.manufacture });
      }
      setSuccess(true);
      setTimeout(() => { setSuccess(false); }, 2000);
    } catch (error) {
      setFail(true);
      setTimeout(() => { setFail(false); }, 2000);
      console.error('Error creating vehicle:', error);
    } finally {
      reset();
      onHandleCancel();
      setIsLoading(false);
    }
  };

  const onHandleCancel = () => {
    reset();
    onCancel();
  };

  useEffect(() => {
    if (isAddVehicleOpen) {
      if (vehicleData) {
        reset(vehicleData);
      } else {
        reset({ id: undefined, model: '', manufacture: '' });
      }
    }
  }, [isAddVehicleOpen, vehicleData, reset]);

  return (
    <div className={`${styles.modal} ${isAddVehicleOpen ? styles.show : styles.hide}`}>
      <div className={styles.modalContent}>
        {isLoading && <div className={styles.loading}>Loading...</div>}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formItem}>
            <label className={styles.label}>Vehicle Type</label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Vehicle type is required" }}
              render={({ field }) => (
                <select {...field} className={`${styles.select} ${errors.type ? styles.errorInput : ''}`}>
                  <option value="" disabled>Select vehicle type</option>
                  {Types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}
            />
            {errors.type && <span className={styles.errorMessage}>{(errors.type as FieldError).message}</span>}
          </div>
          {inputFields.map((item) => (
            <div key={item.name} className={styles.formItem}>
              <label className={styles.label}>{item.label}</label>
              <Controller
                name={item.name}
                control={control}
                rules={{ required: `${item.label} is required` }}
                render={({ field }) => (
                  <input {...field} type={item.type ?? "text"} placeholder={item.placeholder} className={`${styles.input} ${errors[item.name] ? styles.errorInput : ''}`} />
                )}
              />
              {errors[item.name] && <span className={styles.errorMessage}>{(errors[item.name] as FieldError).message}</span>}
            </div>
          ))}
          <div className={styles.buttons}>
            <button type="button" onClick={onHandleCancel} className={styles.cancelButton}>Cancel</button>
            <button type="submit" className={styles.submitButton}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewModel;
