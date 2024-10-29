'use client';

import { Table, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useFetchAllPeriods } from '@/app/hooks/adminHooks/useFetchAllPeriods';
import styles from './bookingsTable.module.css';

interface Vehicle {
  id: string;
  name: string;
}

interface UniqueVehicle {
  id: string;
  vehicle: Vehicle;
}

interface User {
  id: string;
  name: string;
}

interface Period {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  uniqueVehicle: UniqueVehicle;
  user: User;
  vehicleModelName: string;
  vehicleManufacture: string;
  vehicleType: string | null;
}

const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIA...'; // Placeholder image data

const BookingsTable: React.FC = () => {
  const { data: periodData, loading, error } = useFetchAllPeriods();

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Hand':
        return styles.inHand;
      case 'Booked':
        return styles.booked;
      case 'Completed':
        return styles.completed;
      default:
        return '';
    }
  };

  // Define table columns
  const columns: ColumnsType<Period> = [
    
    {
      title: 'Name',
      dataIndex: ['uniqueVehicle', 'vehicle', 'name'],
      key: 'name',
      sorter: (a, b) => a.uniqueVehicle.vehicle.name.localeCompare(b.uniqueVehicle.vehicle.name),
    },
    {
      title: 'Model',
      dataIndex: 'vehicleModelName',
      key: 'model',
      sorter: (a, b) => a.vehicleModelName.localeCompare(b.vehicleModelName),
    },
    {
      title: 'Manufacture',
      dataIndex: 'vehicleManufacture',
      key: 'manufacture',
      sorter: (a, b) => a.vehicleManufacture.localeCompare(b.vehicleManufacture),
    },
    {
      title: 'Type',
      dataIndex: 'vehicleType',
      key: 'type',
      sorter: (a, b) => (a.vehicleType || '').localeCompare(b.vehicleType || ''),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
      render: (status: string) => <span className={getStatusClass(status)}>{status}</span>,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => (a.startDate || '').localeCompare(b.startDate || ''),
      render: (text: string) => new Date(parseInt(text)).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => (a.endDate || '').localeCompare(b.endDate || ''),
      render: (text: string) => new Date(parseInt(text)).toLocaleDateString(),
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
      sorter: (a, b) => (a.user.name || '').localeCompare(b.user.name || ''),
    },
  ];

  const handlePreview = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className={styles.tableContainer}>
      <Table
        columns={columns}
        dataSource={periodData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </div>
  );
};

export default BookingsTable;
