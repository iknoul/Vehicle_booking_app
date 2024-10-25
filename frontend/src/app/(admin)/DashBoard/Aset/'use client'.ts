'use client'

import React, { Suspense, lazy } from 'react';

import { useRouter } from "next/navigation";
import { Button, FloatButton, Table, Spin, Alert, Skeleton, Image } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
// import AddNewVehicle from "./component/AddNewVegic/AddNewVehicle";
import { useEffect, useState } from "react";
// import axios from "axios";
import { useFetchVehicles } from '@/app/hooks/vehicleHooks/useFetchVehicles';
import styles from './manageVehicle.module.css';
import axios from ''

const AddNewVehicle = lazy(() => import('./component/AddNewModel/AddNewModel'));
const AddNewVehicleFromExcel = lazy(() => import('./component/AddVehicleFromExcel/AddVehicleFromExcel'));


interface DataType {
    id?:string
    key: string;
    image: string; 
    name: string;
    description: string;
    price: number;
    quantity: number;
}


const data: DataType[] = [
    {
        key: '1',
        image: '@/app/favicon.ico', 
        name: 'John Brown',
        description: 'dfgwhefw',
        quantity: 32,
        price: 200,
    },
    {
        key: '2',
        image: '@/app/favicon.ico', 
        name: 'Aim Green',
        price: 200,
        quantity: 42,
        description: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        image: '@/app/favicon.ico', 
        name: 'Joe Black',
        price: 343,
        quantity: 32,
        description: 'Sydney No. 1 Lake Park',
    },
    {
        key: '4',
        image: '@/app/favicon.ico', 
        name: 'Jim Red',
        price: 23,
        quantity: 32,
        description: 'London No. 2 Lake Park',
    },
];

interface TableData{
    id:string
    key: string,
    image: string, 
    name: string,
    price: number,
    quantity: number,
    description: string,
    
}

const DashBoard = () => {

    const [tableData, setTableData] = useState<TableData[]>([])
    const [isAddVehicleOpen, setIsAddVehicleOpen] = useState<boolean>(false);
    const [isAddVehicleFromExcelOpen, setIsAddVehicleFromExcelOpen] = useState<boolean>(false);
    const [selectedVehicle, setSelectedVehicle] = useState<DataType | null>(null);
    const [succes, setSucces] = useState(false)
    const [fail, setFail] = useState(false)
    const [isLoading, setIsLoading]  = useState<boolean>(true)
    const router = useRouter();

    const { vehicles, loading, error } = useFetchVehicles();



    const columns: TableColumnsType<DataType> = [
      {
          title: 'Image',
          dataIndex: 'image',
          key: 'image',
          width: '15%',
          render: (text: string) =>  
          <Image
            width={50}
            height={50}
            src={text}
            fallback="data:image/png;base64,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"
        />,
      },
      {
          title: 'Name',
          dataIndex: 'name',    
          filterMode: 'tree',
          filterSearch: true,
          width: '30%',
          sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
          title: 'Description',
          dataIndex: 'description',    
          filterMode: 'tree',
          filterSearch: true,
          width: '50%',
      },
      {
          title: 'Price',
          dataIndex: 'price',
          sorter: (a, b) => a.price - b.price,
      },
      {
          title: 'Quantity',
          dataIndex: 'quantity',
          sorter: (a, b) => a.quantity - b.quantity,
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
        // try {
        //     const response = await axios.post('http://localhost:4000/graphql', {
        //         query: `
        //           mutation {
        //             deleteVehicel(id: ${id}) {
        //                 success
        //                 message
        //             }
        //             }
        //         `,
        //         variables: {},
        //       });
        //        setSucces(true)
        //        setTimeout(()=>{setSucces(false)}, 2000)
        //     } catch (error) {
        //         setFail(true)
        //         setTimeout((()=>{setFail(false)}),2000)
        //         console.error('Error creating vehicle:', error);
        //         throw error; // Rethrow or handle the error as needed
            } 
    }

    const fetchVehicles = async() =>{
        try {
            const response = await axios.post('http://localhost:4000/graphql', {
                query: `
                  query Vehicels {
                    vehicles {
                      description
                      id
                      image
                      name
                      price
                      quantity
                    }
                  }
                `,
                variables: {},
              });
                  
                Handle the response data
                const vehicels = response.data.data.vehicles;
                const vehicels = vehicles
                console.log(vehicels)
                setTableData(vehicels)
                setIsLoading(false)
            } catch (error) {
                console.error('Error creating vehicle:', error);
                throw error; // Rethrow or handle the error as needed
            } 
    }
    useEffect(() => {
        if (vehicles && vehicles.length > 0) {
          const formattedVehicles = vehicles.map((vehicle: any, index: number) => ({
            key: vehicle.id || index.toString(),
            image: vehicle.image,
            name: vehicle.name,
            price: vehicle.price,
            quantity: vehicle.quantity,
            description: vehicle.description,
          }));
          setTableData(formattedVehicles);
        }
      }, [vehicles]);

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
                <AddNewVehicle 
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
            <Skeleton  loading={isLoading}>
                <Table<DataType> className={styles.table} columns={columns} dataSource={tableData} onChange={onChange} />
            </Skeleton>
        </div>

    );
}  

export default DashBoard;
