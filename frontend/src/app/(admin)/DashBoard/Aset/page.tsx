'use client'

import React, { Suspense, lazy } from 'react';
import { useRouter } from "next/navigation";
import { Button, FloatButton, Table, Spin, Alert, Skeleton, Image, message } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useEffect, useState } from "react";
import { useFetchVehicleModels } from '@/app/hooks/vehicleHooks/useFetchVehiclesModel';
import { useDeleteVehicleModel } from '@/app/hooks/vehicleHooks/useDeleteVehicleModel';
import styles from './aset.module.css';
import LoaderContiner from '@/app/components/LoaderContainer';
import Loader from '@/app/components/Loader';
import { delay } from '@/app/utils/addDelay';
import { useCreateVehicleModel } from '@/app/hooks/vehicleHooks/useCreateVehicleModel';
import { useUpdateVehicleModel } from '@/app/hooks/vehicleHooks/useUpdateVehicleModel';
import { useUploadExcelFile } from '@/app/hooks/vehicleHooks/useUploadExcelFile';

const AddNewModel = lazy(() => import('./component/AddNewModel/AddNewModel'));
const AddNewVehicleFromExcel = lazy(() => import('./component/AddVehicleFromExcel/AddVehicleFromExcel'));


interface DataType {
    id?: string;
    model: string;
    type:string;
    manufacture: string; 
}

const DashBoard = () => {
    const [isAddVehicleOpen, setIsAddVehicleOpen] = useState<boolean>(false);
    const [isAddVehicleFromExcelOpen, setIsAddVehicleFromExcelOpen] = useState<boolean>(false);
    const [selectedVehicle, setSelectedVehicle] = useState<DataType | null>(null);
    const [succes, setSucces] = useState(false)
    const [fail, setFail] = useState(false)
    const [isLoading, setIsLoading]  = useState<boolean>(true)
    const router = useRouter();

    const { vehicleModels, loading: vehiclesLoading, refetch, error: fetchError } = useFetchVehicleModels();
    const { removeVehicleModel, loading: deleteLoading, error: deleteError } = useDeleteVehicleModel();
    const { createNewVehicleModel, loading: creareVehicleLoading, error: createNewVehicleError } = useCreateVehicleModel();
    const { updateExistingVehicleModel, loading: updateVehicleLoading, error: updateVehicleError } = useUpdateVehicleModel();
    const { uploadExcelFile, loading: uploadExcelLoading, error: uploadExcelError } = useUploadExcelFile(); // Use the mutation hook


    interface FormValues {
        id?: string;
        model: string;
        type: string;
        manufacture: string;
    }

    const columns: TableColumnsType<DataType> = [
      
        {
            title: 'Model',
            dataIndex: 'model',    
            filterMode: 'tree',
            filterSearch: true,
            width: '30%',
            sorter: (a, b) => a.model.localeCompare(b.model),
        },
        {
            title: 'Type',
            dataIndex: 'type',    
            filterMode: 'tree',
            filterSearch: true,
            width: '30%',
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
            title: 'Manufacture',
            dataIndex: 'manufacture',    
            filterMode: 'tree',
            filterSearch: true,
            width: '50%',
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_: any, record: DataType, index: number) => {
                const editable = true;
    
                const handleEditClick = () => {
                    console.log('Edit clicked for index:', index, record);
                    setSelectedVehicle(record); // Set the selected vehicle data
                    setIsAddVehicleOpen(true); // Open the modal
                };
    
                const handleDeleteClick = () => {
                        if(record.id){
                            handleDelete(record.id)
                        }
                    console.log('Delete clicked for index:', index);
                    // Handle delete logic here
                };
  
                return editable ? (
                    <span className={styles.operation}>
                        <i className="fa-regular fa-pen-to-square" onClick={handleEditClick}></i>
                        <i className="fa-solid fa-trash" onClick={handleDeleteClick}></i>
                    </span>
                ) : (
                    <></>
                );
            },
        },
    ];
    
    // handle the manual uploading of vehicle model data
    const onSubmit = async (data: FormValues, onHandleCancel: Function) => {
        setIsLoading(true);
        try {
            if (data.id) {
                await updateExistingVehicleModel({ id: data.id, model: data.model, type: data.type, manufacture: data.manufacture });
            } else {
                await createNewVehicleModel({ model: data.model, type: data.type, manufacture: data.manufacture });
            }
            setSucces(true);
            setTimeout(() => { setSucces(false); }, 2000);
            delay(2000)
            message.success({content:`successfully ${data.id?'updated':'added'} vehicle-model data`})

        } catch (error) {
            message.error({content:`Error ${data.id?'updating':'adding'} vehicle-model`});
            setFail(true);
            setTimeout(() => { setFail(false); }, 2000);
          console.error('Error creating vehicle-model:', error);
        } finally {
            onHandleCancel();
            setIsLoading(false);
        }
    };
    
    const onSubmitExcelFile = async (fileList:File[], onHandleCancel: Function) => {
        if (fileList.length === 0) {
            message.warning({content:'Please select a file to upload!'})
            return;
        }
    
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file', file);
        });
    
        try {
            const response = await uploadExcelFile(fileList[0]);
            if (response.success) {
                message.success({content: 'File uploaded successfully'})
            } else if (response.file && response.filename) {
                // const blob = new Blob([response.file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                // const url = URL.createObjectURL(blob);
                // const link = document.createElement('a');
                // link.href = url;
                // link.download = response.filename;
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);
                message.warning({content: 
                    <>
                        <p>File processed with errors. rows: {response.errorRows.map((errorRow)=> ` ${errorRow.rowIndex}, `)}</p>

                        <p>Please check the downloaded error report.</p>
                    </>
                    
                })
            }
            setSucces(true);
            setTimeout(() => { setSucces(false); }, 2000);
            delay(1000)
        } catch (err) {
            console.error("Error uploading file:", err);
            message.error({content:'File upload failed.'});
        }
        onHandleCancel()
    };
    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, extra) => {
        console.log('params', pagination, filters, extra);
    };

    const onCancel = () => {
        setIsAddVehicleOpen(false);
        setSelectedVehicle(null); // Clear the selected vehicle when closing
    };

    const openModel = () => {
        setIsAddVehicleOpen(true);
    };

    const handleDelete = async (id:string) =>{
        try {
            await removeVehicleModel(id);
            setSucces(true)
            setTimeout(()=>{setSucces(false)}, 1000)
            delay(2000)
            message.success({content:'Vehicle model deleted successfully'})
          } catch (err) {
            message.error({content:'Error deleting vehicle'});
          }
    }
    useEffect(()=>{
        refetch()
    }, [succes, isAddVehicleFromExcelOpen])
    return (
        <LoaderContiner 
            isLoading={deleteLoading || uploadExcelLoading || creareVehicleLoading ||updateVehicleLoading } 
            spinner={<Loader />}
        >
        <div className={styles.d}>          

           {isAddVehicleOpen &&
            <Suspense fallback={<Spin tip="Loading components..."/>}>
                <AddNewModel 
                    isAddVehicleOpen={isAddVehicleOpen} 
                    onCancel={onCancel} 
                    vehicleData={selectedVehicle}
                    setSuccess={setSucces}
                    setFail={setFail}
                    onSubmit={onSubmit}
                    // Pass the selected vehicle data
                />
            </Suspense>
           }
           <Suspense fallback="Loading ...">
                <AddNewVehicleFromExcel
                    isAddVehicleFromExcelOpen={isAddVehicleFromExcelOpen}
                    onCancel={()=>{setIsAddVehicleFromExcelOpen(false)}}
                    onSubmit={onSubmitExcelFile}
                />
           </Suspense>
           <div className={styles.buttonGroup}>
            <Button 
                    type="primary" 
                    danger 
                    className={styles.button} 
                    block={false}
                    onClick={openModel}
                >
                    Add new
                </Button>
                <FloatButton 
                    icon={<i className="fa-solid fa-file-import"></i>}
                    shape="square" 
                    className={styles.button} 
                    onClick={()=>{setIsAddVehicleFromExcelOpen(true)}}
                />
           </div>
            <Skeleton  loading={vehiclesLoading}>
                <Table<DataType> className={styles.table} columns={columns}  dataSource={vehicleModels}  onChange={onChange} />
            </Skeleton>
        </div>
        </LoaderContiner>
    );
}  

export default DashBoard;
