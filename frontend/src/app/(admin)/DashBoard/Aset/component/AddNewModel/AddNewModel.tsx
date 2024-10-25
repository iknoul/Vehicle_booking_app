import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin, Upload, Image, Select } from "antd"; 
import { RcFile } from 'antd/es/upload/interface'; // Import RcFile from Ant Design
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useForm, Controller } from "react-hook-form";
import { useCreateVehicleModel } from '@/app/hooks/vehicleHooks/useCreateVehicleModel';
import { useUpdateVehicleModel } from '@/app/hooks/vehicleHooks/useUpdateVehicleModel';


interface MyProps {
  isAddVehicleOpen: boolean;
  setSuccess:Function;
  setFail:Function;
  onCancel: Function;
  vehicleData?: FormValues | null; 
}

interface FormValues {
  id?: string
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

const Types = [
  "SUV", "HATCH_BACK", "SEDAN"
]
const inputField: InputField[] = [
  { label: "model name", placeholder: "Enter the model name", name: "model", required: true },
  { label: "manufacture name", placeholder: "Enter your manufacture name", name: "manufacture", required: true },
];

const AddNewModel: React.FC<MyProps> = ({ isAddVehicleOpen, onCancel, vehicleData, setSuccess, setFail }) => {

    const { createNewVehicleModel, loading: createVehicleModelsLoading, error: createVehicleModelsError } = useCreateVehicleModel();
    const { updateExistingVehicleModel, loading: updateVehicleModelsLoading, error: updateVehicleModelsError } = useUpdateVehicleModel();

    const {Option} = Select

    const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
        model: '',
        manufacture: '',
        },
    });
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit = async (data: FormValues) => {
      console.log("Form data:", data);
        
      try {

        if(data.id){
          await updateExistingVehicleModel({
            id: data.id,
            model: data.model,
            type: data.type,
            manufacture: data.manufacture,
          });
        }
        else{
          await createNewVehicleModel({
            model: data.model,
            type: data.type,
            manufacture: data.manufacture,
          });
        }
        

        setSuccess(true)
        setTimeout((()=>{setSuccess(false)}),2000)
       
        } catch (error) {
            setFail(true)
            setTimeout((()=>{setFail(false)}),2000)
            console.error('Error creating vehicle:', error);
            throw error; // Rethrow or handle the error as needed
        } finally {
            reset(); // Clear the form after the operation
            onHandleCancel(); // Call the cancel handler to close the form or reset state
            setIsLoading(false)
        }
    };
    

    const onHandleCancel = () => {
        reset(); // Clear the form on cancel
        onCancel();
    };

    useEffect(() => {
      if (isAddVehicleOpen) { // Check if the modal is open
          if (vehicleData) {
              console.log('Vehicle data:', vehicleData);
              reset(vehicleData); // Reset the form with vehicleData directly
          } else {
              console.log('No vehicle data provided. Resetting form.');
              reset({
                  id: undefined,
                  model: '',
                  manufacture: '',
              }); // Reset form if no vehicleData
          }
      }
    }, [isAddVehicleOpen, vehicleData, reset]); // Add isAddVehicleOpen and reset as dependencies

    return (

        <Modal 
        open={isAddVehicleOpen} 
        okText='Submit'
        onCancel={onHandleCancel}
        onOk={()=>{
            setIsLoading(true)
            setTimeout(handleSubmit(onSubmit), 1000)} 
        }
        >
        <Spin  tip="Loading" spinning={isLoading}>

            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>

                <Form.Item label="Vehicle Model" required>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                placeholder="Select vehicle model"
                            >
                                {Types.map(type => (
                                    <Option key={type} value={type}>
                                        {type}
                                    </Option>
                                ))}
                            </Select>
                        )}
                        rules={{ required: true }}
                    />
                </Form.Item>
                {inputField.map((item, index) => (
                <Form.Item
                    key={item.name}
                    label={item.label}
                    required={item.required}
                    validateStatus={vehicleData && !vehicleData[item.name] ? "error" : ""}
                    help={vehicleData && !vehicleData[item.name] ? `${item.label} is required` : ""}
                >
                    <Controller
                    name={item.name}
                    control={control}
                    render={({ field }) => (
                        <Input
                        {...field}
                        type={item.type ?? "text"}
                        placeholder={item.placeholder}
                        />
                    )}
                    rules={{ required: item.required }}
                    />
                </Form.Item>
                ))}      
            </Form>
    </Spin>
    </Modal>
  );
};

export default AddNewModel;
