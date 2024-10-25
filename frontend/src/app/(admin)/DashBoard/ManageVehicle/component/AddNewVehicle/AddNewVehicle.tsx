// AddNewVehicle.tsx
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { useCreateVehicle } from '@/app/hooks/vehicleHooks/useCreateVehicle';
import { useUpdateVehicle } from '@/app/hooks/vehicleHooks/useUpdateVehicle';
import { useForm } from "react-hook-form";

const InventoryInputs = lazy(() => import("./InventoryInputs"));
const IdentificationInputs = lazy(() => import("./IdentificationInputs"));

interface MyProps {
  isAddVehicleOpen: boolean;
  setSuccess: Function;
  setFail: Function;
  onCancel: Function;
  vehicleData?: VehicleData;
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

const AddNewVehicle: React.FC<MyProps> = ({ isAddVehicleOpen, onCancel, vehicleData, setSuccess, setFail }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { control, setValue, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      key: '',
      model: '',
      name: '',
      price: 0,
      description: '',
      quantity: 0,
      image: [],
    },
  });

  const image = watch('image');
  const { createNewVehicle, loading: createVehiclesLoading } = useCreateVehicle();
  const { updateExistingVehicle, loading: updateVehiclesLoading } = useUpdateVehicle();

  const handleNext = (data: FormValues) => {
    setCurrentStep(2);
  };

  const handleFormSubmit = async (data: FormValues) => {
    console.log(data, 'here i print the form data')
    try {
      if (vehicleData?.id) {
        await updateExistingVehicle({
          id: vehicleData.id,
          ...data,
        });
      } else {
        await createNewVehicle(data);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      setFail(true);
      console.error("Error saving vehicle:", error);
    } finally {
      onCancel();
    }
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
          key: '',
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

  useEffect(() => {
    console.log(image, 'here the image input');
  }, [image]);

  return (
    <Modal
      open={isAddVehicleOpen}
      okText="Submit"
      onCancel={onHandleCancel}
      footer={null}
    >
      <Suspense fallback={<p>loading ..</p>}>
        <Spin tip="Loading" spinning={createVehiclesLoading || updateVehiclesLoading}>
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
        </Spin>
      </Suspense>
    </Modal>
  );
};

export default AddNewVehicle;
