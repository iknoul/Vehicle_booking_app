import React, { useEffect, useMemo, useState } from 'react';
import styles from './bookingTable.module.css';
import { useFetchPeriods } from '@/app/hooks/userHooks/useFetchPeriods';

interface Vehicle {
  id: string;
  name: string;
}

interface UniqueVehicle {
  id: string;
  vehicle: Vehicle;
}

interface Period {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  uniqueVehicle: UniqueVehicle;
  vehicleModelName: string;
  vehicleManufacture: string;
  vehicleType: string;
}

const BookingTable = () => {
  const { data, refetch } = useFetchPeriods();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Period | 'vehicleName'; direction: 'ascending' | 'descending' } | null>(null);
  const [bookings, setBookings] = useState<Period[] | []>([]);

  // Helper function to format the timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
  };

  useEffect(() => {
    if (data) {
      setBookings(data);
    }
  }, [data]);

  const sortedBookings = useMemo(() => {
    let sortableBookings = [...bookings];
    if (sortConfig !== null) {
      sortableBookings.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'vehicleName') {
          aValue = a.uniqueVehicle.vehicle.name;
          bValue = b.uniqueVehicle.vehicle.name;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  }, [bookings, sortConfig]);

  const requestSort = (key: keyof Period | 'vehicleName') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className={styles.bookingSection}>
      <table className={styles.bookingTable}>
        <thead>
          <tr>
            <th>
              <span>
                <a>Vehicle</a>
                <i
                  className="fa-solid fa-sort"
                  onClick={() => requestSort('vehicleName')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </span>
            </th>
            <th>
              <span>
                <a>Model</a>
                <i
                  className="fa-solid fa-sort"
                  onClick={() => requestSort('vehicleModelName')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </span>
            </th>
            <th>
              <span>
                <a>Manufacture</a>
                <i
                  className="fa-solid fa-sort"
                  onClick={() => requestSort('vehicleManufacture')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </span>
            </th>
            <th>
              <span>
                <a>Start Date</a>
                <i
                  className="fa-solid fa-sort"
                  onClick={() => requestSort('startDate')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </span>
            </th>
            <th>
              <span>
                <a>End Date</a>
                <i
                  className="fa-solid fa-sort"
                  onClick={() => requestSort('endDate')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </span>
            </th>
            <th>
              <span>
                <a>Status</a>
                <i
                  className="fa-solid fa-sort"
                  onClick={() => requestSort('status')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.length > 0 ? (
            sortedBookings.map((booking, index) => (
              <tr key={`${booking.id}-${index}`}>
                <td>{booking.uniqueVehicle.vehicle.name}</td>
                <td>{booking.vehicleModelName}</td>
                <td>{booking.vehicleManufacture}</td>
                <td>{formatDate(booking.startDate)}</td>
                <td>{formatDate(booking.endDate)}</td>
                <td>{booking.status}</td>
                <td className={styles.action}>
                  {booking.status === 'Returned' ? (
                    <span className={styles.actionItem}>
                      <i className="fa-solid fa-retweet" title="book again"></i>
                      <a>Book again</a>
                    </span>
                  ) : booking.status === 'Booked' ? (
                    <>
                      <span className={styles.actionItem} style={{color:'red'}}>
                        <i className="fa-solid fa-xmark" title="cancel"></i>
                        <a>Cancel</a>
                      </span>
                      <span className={styles.actionItem} style={{color:'green'}}>
                        <i className="fa-solid fa-retweet" title="extend"></i>
                        <a>Extend</a>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={styles.actionItem} style={{color:'blue'}}>
                        <i className="fa-regular fa-share-from-square" title="return"></i>
                        <a>Return</a>
                      </span>
                      <span className={styles.actionItem} style={{color:'green'}}>
                        <i className="fa-solid fa-retweet" title="extend"></i>
                        <a>Extend</a>
                      </span>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No bookings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
