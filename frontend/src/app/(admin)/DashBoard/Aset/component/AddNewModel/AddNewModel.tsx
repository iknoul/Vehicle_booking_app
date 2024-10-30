import React, { useEffect } from "react";
import { useForm, Controller, FieldError } from "react-hook-form";
import styles from './addNewModel.module.css';

interface MyProps {
	isAddVehicleOpen: boolean;
	setSuccess: Function;
	onCancel: Function;
	vehicleData?: FormValues | null;
	onSubmit: (data: FormValues, onHandleCancel: () => void) => void;
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

const Types = ["SUV", "HATCH_BACK", "SEDAN", "TRUCK", "Coupe"];

const inputFields: InputField[] = [
	{ label: "Model Name", placeholder: "Enter the model name", name: "model", required: true },
	{ label: "Manufacture Name", placeholder: "Enter the manufacture name", name: "manufacture", required: true },
];

const AddNewModel: React.FC<MyProps> = ({ isAddVehicleOpen, onCancel, vehicleData, onSubmit }) => {
  	const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ defaultValues: { model: '', manufacture: '', type: '' } });

	const onHandleCancel = () => {
		reset();
		onCancel();
	};

	const onSubmitHandler = (data: FormValues) => {
		// Ensure that the type field is provided
		if (!data.type) data.type = Types[0];  // Default to the first type if not provided
		onSubmit(data, onHandleCancel);
	};

  useEffect(() => {
    if (isAddVehicleOpen) {
		if (vehicleData) {
			reset(vehicleData);
		} else {
			reset({ id: undefined, model: '', manufacture: '', type: '' });
		}
    }
  }, [isAddVehicleOpen, vehicleData, reset]);

	return (
		<div className={`${styles.modal} ${isAddVehicleOpen ? styles.show : styles.hide}`}>
			<div className={styles.modalContent}>
				<form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
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
