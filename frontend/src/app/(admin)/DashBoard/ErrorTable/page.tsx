'use client'
import React from 'react';
import { useFetchErrorData } from '@/app/hooks/vehicleHooks/useFetchErrorData';
import { Skeleton, Table, type TableColumnsType, type TableProps } from 'antd';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import styles from './errorTable.module.css';

interface ErrorData {
    id: number;
    groupId: string;
    rowIndex: number;
    model?: string;
    type?: string;
    manufacture?: string;
    errorMessage: string;
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const ErrorDataTable = () => {

    const { errorData, loading, error, refetch } = useFetchErrorData();

    const columns: TableColumnsType<ErrorData> = [
        {
            title: 'Group ID',
            dataIndex: 'groupId',
            filterMode: 'tree',
            filterSearch: true,
            width: '30%',
            sorter: (a, b) => a.groupId.localeCompare(b.groupId),
        },
        {
            title: 'Model',
            dataIndex: 'model',
            filterMode: 'tree',
            filterSearch: true,
            width: '30%',
            sorter: (a, b) => (a.model || "").localeCompare(b.model || ""),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            filterMode: 'tree',
            filterSearch: true,
            width: '30%',
            sorter: (a, b) => (a.type || "").localeCompare(b.type || ""),
        },
        {
            title: 'Manufacture',
            dataIndex: 'manufacture',
            filterMode: 'tree',
            filterSearch: true,
            width: '50%',
            sorter: (a, b) => (a.manufacture || "").localeCompare(b.manufacture || ""),
        },
        {
            title: 'Error',
            dataIndex: 'errorMessage',
            filterMode: 'tree',
            filterSearch: true,
            width: '50%',
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_: any, record: ErrorData) => {
                const handleDownloadClick = () => {
                    alert('here')
                    downloadErrorGroup(record.groupId);
                };
    
                return (
                    <span className={styles.operation} onClick={handleDownloadClick}>
                        <i className="fa-solid fa-file-arrow-down" ></i>
                        <p>Download Errors</p>
                    </span>
                );
            },
        },
    ];
    // Function to download errors as an Excel file
    const downloadErrorGroup = (groupId: string,) => {
        // Fetch error data based on groupId
        const errorRows = errorData.filter(row => row.groupId === groupId);

        if (errorRows.length > 0) {
            // Create a worksheet from the error rows
            const worksheet = XLSX.utils.json_to_sheet(errorRows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, `Errors_${groupId}`);

            // Generate a buffer and save it
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
            saveAs(data, `Errors_${groupId}.xlsx`);
        } else {
            alert("No error data available for this group.");
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const onChange: TableProps<ErrorData>['onChange'] = (pagination, filters, extra) => {
        console.log('params', pagination, filters, extra);
    };
    
    return (
        <div>
            <button onClick={() => refetch()} className={styles.button}>
            Refetch Data
            </button>
            <p className={styles.note}>* Download the Group of errors occured at a single moment.</p>
            <Skeleton loading={loading}>
                <Table<ErrorData>
                    className={styles.table}
                    columns={columns}
                    dataSource={errorData}
                    onChange={onChange}
                />
            </Skeleton>
      </div>
    );
};

export default ErrorDataTable;
