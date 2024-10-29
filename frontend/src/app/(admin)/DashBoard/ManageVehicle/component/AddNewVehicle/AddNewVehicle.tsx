import React, { lazy, Suspense, useEffect, useState } from "react";
import { Modal } from "antd";
import { useForm, Controller } from "react-hook-form";

const InventoryInputs = lazy(() => import("./InventoryInputs"));
const IdentificationInputs = lazy(() => import("./IdentificationInputs"));

interface MyProps {
  isAddVehicleOpen: boolean;
  setSuccess: Function;
  setFail: Function;
  onCancel: Function;
  vehicleData?: VehicleData;
  onSubmit: Function;
}

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

interface VehicleData {
  id: string;
  key: string;
  model: string;
  image: string[];
  name: string;
  price: number;
  description: string;
  quantity: number;
}

const AddNewVehicle: React.FC<MyProps> = ({ isAddVehicleOpen, onCancel, vehicleData, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { control, setValue, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      key: 'defaultKey',
      model: '',
      name: '',
      price: 0,
      description: '',
      quantity: 0,
      image: [],
    },
  });

  const image = watch('image');

  const handleNext = (data: FormValues) => {
    setCurrentStep(2);
  };

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data, vehicleData?.id);
  };

  const onHandleCancel = () => {
    reset();
    onCancel();
  };

  useEffect(() => {
    if (isAddVehicleOpen) {
      if (vehicleData) {
        reset({ ...vehicleData, image: [] });
      } else {
        reset({
          key: 'defaultKey',
          model: '',
          name: '',
          price: 0,
          description: '',
          quantity: 0,
          image: [],
        });
      }
      setCurrentStep(1);
    }
  }, [isAddVehicleOpen, vehicleData, reset]);

  return (
    <Modal
      open={isAddVehicleOpen}
      okText="Submit"
      onCancel={onHandleCancel}
      footer={null}
    >
      <Suspense fallback={<p>loading ..</p>}>
        {currentStep === 1 && (
          <IdentificationInputs
            control={control}
            onNext={handleSubmit(handleNext)}
            errors={errors}
          />
        )}
        {currentStep === 2 && (
          <InventoryInputs
            selectedVehicleImage={vehicleData?.image[0]}
            control={control}
            onSubmit={handleSubmit(handleFormSubmit)}
            onBack={() => setCurrentStep(1)}
            errors={errors}
            setValue={setValue}
          />
        )}
      </Suspense>
    </Modal>
  );
};

export default AddNewVehicle;
