import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin, Upload, Image, Select, Button } from "antd"; 
import { RcFile } from 'antd/es/upload/interface'; // Import RcFile from Ant Design
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { useForm, Controller } from "react-hook-form";
import { useCreateVehicle } from '@/app/hooks/vehicleHooks/useCreateVehicle';
import { useUpdateVehicle } from '@/app/hooks/vehicleHooks/useUpdateVehicle';
import { useFetchVehicleModels } from "@/app/hooks/vehicleHooks/useFetchVehiclesModel";

const { Option } = Select; // For dropdown options

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

 interface MyProps {
  isAddVehicleOpen: boolean;
  setSuccess:Function;
  setFail:Function;
  onCancel: Function;
  vehicleData?: VehicleData; 
}

interface VehicleModel{
    id: string;
    model: string;
    manufacture: string;
    type: string;
}
interface FormValues {
  id?: string;
  key: string;
  model: string; // Add model field
  image?: File[];
  name: string;
  price: number;
  description: string;
  quantity: number;
}
interface VehicleData {
    id?: string;
    key: string;
    // vehicleModel: VehicleModel; // Add model field
    model:string
    image?: string[];
    name: string;
    price: number;
    description: string;
    quantity: number;
  }

interface InputField {
  label: string;
  placeholder: string; 
  name: 'key' | 'price' | 'description' | 'quantity' | 'name' ; 
  required: boolean;
  type?: string;
}

const inputField: InputField[] = [
  { label: "Key Value", placeholder: "Enter the key value", name: "key", required: true },
  { label: "Name", placeholder: "Enter your name", name: "name", required: true },
  { label: "Price", placeholder: "Enter the car price", name: "price", type: "number", required: true },
  { label: "Description", placeholder: "Enter the description", name: "description", required: true },
  { label: "Quantity", placeholder: "Enter the quantity", name: "quantity", type: "number", required: true },
];

const AddNewVehicle: React.FC<MyProps> = ({ isAddVehicleOpen, onCancel, vehicleData, setSuccess, setFail }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    
    const { createNewVehicle, loading: createVehiclesLoading } = useCreateVehicle();
    const { updateExistingVehicle, loading: updateVehiclesLoading } = useUpdateVehicle();

    const { vehicleModels, loading: vehiclesLoading, refetch, error: fetchError } = useFetchVehicleModels();


    const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
        defaultValues: {
            key: '',
            model: '', // Default value for model
            image: undefined,
            name: '',
            price: 0,
            description: '',
            quantity: 0,
        },
    });
    
    

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url ?? (file.preview as string));
        setPreviewOpen(true);
    };
    const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        // Map the newFileList to RcFile (native File objects) from UploadFile
        const rcFileList = newFileList.map(file => file.originFileObj as RcFile); // Extract RcFile
        
        setFileList(newFileList); // Update the fileList with the Ant Design structure for display
    
        // Set the RcFile (native file) in the form field
        setValue('image', rcFileList); // Update the form with the native RcFile objects
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <div style={{ marginTop: 8 }}>Upload images</div>
        </button>
    );

    const onSubmit = async (data: FormValues) => {
        // const images = fileList.map(file => file.thumbUrl); 
        const images = fileList.map(file => file.originFileObj as RcFile); // Extracting RcFile from UploadFile
        try {
            if (data.id) {
                await updateExistingVehicle({
                    id: data.id,
                    name: data.name,
                    model: data.model|| "as", // Add model field
                    price: parseFloat(data.price.toString()),
                    description: data.description,
                    quantity: parseInt(data.quantity.toString(), 10),
                    image: images,
                });
            } else {
                await createNewVehicle({
                    name: data.name,
                    model: data.model || "as", // Add model field
                    price: parseFloat(data.price.toString()),
                    description: data.description,
                    quantity: parseInt(data.quantity.toString(), 10),
                    image: images,
                });
            }
            setSuccess(true);
            setInterval(()=>{setSuccess(false)}, 2000)
        } catch (error) {
            setFail(true);
            console.error('Error creating vehicle:', error);
        } finally {
            reset();
            onHandleCancel();
        }
    };

    const onHandleCancel = () => {
        reset();
        onCancel();
    };

    useEffect(() => {
        setFileList([]);
        if (isAddVehicleOpen) {            
            if (vehicleData) {
                reset({...vehicleData, image:undefined})
                setPreviewImage(vehicleData.image?vehicleData.image[0]:'')
            } else {
                reset({
                    id: undefined,
                    key: '',
                    model: '', // Reset model field
                    name: '',
                    price: 0,
                    description: '',
                    quantity: 0,
                });
            }
        }
    }, [isAddVehicleOpen, vehicleData, reset]);

    return (
        <Modal
            open={isAddVehicleOpen}
            okText="Submit"
            onCancel={onHandleCancel}
            onOk={() => {
                handleSubmit(onSubmit)();
            }}
        >
            <Spin tip="Loading" spinning={createVehiclesLoading || updateVehiclesLoading}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                  {/* Vehicle Model Select Dropdown */}
                  <Form.Item label="Vehicle Model" required>
                        <Controller
                            name="model"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select vehicle model"
                                >
                                    {vehicleModels.map(model => (
                                        <Option key={model?.model} value={model.id}>
                                            {model.model}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                            rules={{ required: true }}
                        />
                    </Form.Item>
                    {inputField.map(item => (
                        <Form.Item
                            key={item.name}
                            label={item.label}
                            required={item.required}
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
                     {/* <Form.Item>
                        <Controller
                            name="image"
                            control={control}
                            rules={{ required: 'Profile picture is required' }}
                            render={({ field }) => (
                                <Upload
                                    {...field}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleChange}
                                    beforeUpload={() => false}
                                    >
                                    {fileList.length >= 6 ? null : <UploadOutlined />}
                                </Upload>
                        )}
                        /> */}
                        {/* {errors.profilePic && <p className={styles.err}>* {errors.profilePic.message}</p>} */}
                    {/* </Form.Item> */}

                    <Form.Item>
                        <Upload
                            
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            accept=".png, .jpg, .jpeg"
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>

                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
      
                    </Form.Item>
                    <Upload onChange={handleChange} accept=".glb, .gltf">
                        <Button icon={<UploadOutlined />}>Upload the 3D image</Button>
                    </Upload>
                    
                </Form>
            </Spin>
        </Modal>
    );
};

export default AddNewVehicle;
