'use client'

import React, { Suspense, lazy } from 'react';

import { useRouter } from "next/navigation";
import { Button, FloatButton, Table, Spin, Alert, Skeleton, Image } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
// import AddNewVehicle from "./component/AddNewVegic/AddNewVehicle";
import { useEffect, useState } from "react";
// import axios from "axios";
import { useFetchVehicleModels } from '@/app/hooks/vehicleHooks/useFetchVehiclesModel';
import { useDeleteVehicleModel } from '@/app/hooks/vehicleHooks/useDeleteVehicleModel';
import styles from './aset.module.css';
import { image } from 'd3';

const AddNewModel = lazy(() => import('./component/AddNewModel/AddNewModel'));
const AddNewVehicleFromExcel = lazy(() => import('./component/AddVehicleFromExcel/AddVehicleFromExcel'));


interface DataType {
    id?: string;
    model: string;
    type:string;
    manufacture: string; 
}

const modelData = [
    {model: 'www', manufacture:"BMW", type: "SUV"},
    {model: 'www', manufacture:"BMW", type: "SEDAN"},
    {model: 'www', manufacture:"BMW", type: "HATCH_BACK"},
    {model: 'www', manufacture:"BMW", type: "HATCH_BACK"},
    {model: 'www', manufacture:"BMW", type: "HATCH_BACK"},
    {model: 'www', manufacture:"BMW", type: "HATCH_BACK"},
]


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
  

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, extra) => {
        console.log('params', pagination, filters, extra);
    };

    const onCancel = () => {
        setIsAddVehicleOpen(false);
        setSelectedVehicle(null); // Clear the selected vehicle when closing
        console.log(selectedVehicle, "sle")
    };

    const openModel = () => {
        setIsAddVehicleOpen(true);
    };

    const handleDelete = async (id:string) =>{
        try {
            await removeVehicleModel(id);
            setSucces(true)
            setInterval(()=>{setSucces(false)}, 1000)
            // alert('Vehicle deleted successfully');
          } catch (err) {
            alert('Error deleting vehicle');
          }
    }
    useEffect(()=>{
        refetch()
    }, [succes])
    return (
        <div className={styles.d}>
            
        {succes &&
            <Alert type="success" message="add success" showIcon/>
        }
        {fail &&
            <Alert type="error" message="add fail" showIcon/>
        }
        
            

           {isAddVehicleOpen &&
            <Suspense fallback={<Spin tip="Loading components..."/>}>
                <AddNewModel 
                    isAddVehicleOpen={isAddVehicleOpen} 
                    onCancel={onCancel} 
                    vehicleData={selectedVehicle}
                    setSuccess={setSucces}
                    setFail={setFail}
                    // Pass the selected vehicle data
                />
            </Suspense>
           }
           <Suspense fallback="Loading ...">
                <AddNewVehicleFromExcel
                    isAddVehicleFromExcelOpen={isAddVehicleFromExcelOpen}
                    onCancel={()=>{setIsAddVehicleFromExcelOpen(false)}}
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

    );
}  

export default DashBoard;
