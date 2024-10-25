import React, { useEffect, useMemo, useState } from 'react';
import styles from './bookingTable.module.css';
import { useFetchPeriods } from '@/app/hooks/userHooks/useFetchPeriods';

interface Booking {
  id: number;
  vehicle: string;
  date: string;
  status: string;
}

const initialBookings: Booking[] = [
  { id: 1, vehicle: 'Toyota Camry', date: '2024-10-15', status: 'Returned' },
  { id: 2, vehicle: 'Honda Accord', date: '2024-10-20', status: 'Booked' },
  { id: 3, vehicle: 'BMW 5 Series', date: '2024-11-05', status: 'In-hand' },
  
];
const BookingTable = () => {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
    const {data, refetch} = useFetchPeriods()
    const [sortConfig, setSortConfig] = useState<{ key: keyof Booking; direction: 'ascending' | 'descending' } | null>(null);
  
    const sortedBookings = useMemo(() => {
      let sortableBookings = [...bookings];
      if (sortConfig !== null) {
        sortableBookings.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
      console.log(sortableBookings, 'here i print the sortable bookings')
      return sortableBookings;
    }, [bookings, sortConfig]);
  
    const requestSort = (key: keyof Booking) => {
      let direction: 'ascending' | 'descending' = 'ascending';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    };
    useEffect(()=>{
      console.log(data, 'the data')
      refetch()
    },[])
  
  return (
    <div className={styles.bookingSection}>
      <table className={styles.bookingTable}>
        <thead>
          <tr>
            <th >
                <span>
                    <a >Vehicle</a>
                    <i className="fa-solid fa-sort" onClick={() => requestSort('vehicle')} style={{ cursor: 'pointer' }}></i> 
                </span>
            </th>
            <th >
                <span>
                    <a >Model</a>
                    <i className="fa-solid fa-sort" onClick={() => requestSort('vehicle')} style={{ cursor: 'pointer' }}></i> 
                </span>
            </th>
            <th >
                <span>
                    <a >Manufacture</a>
                    <i className="fa-solid fa-sort" onClick={() => requestSort('vehicle')} style={{ cursor: 'pointer' }}></i> 
                </span>
            </th>
            <th >
                <span>
                    <a >Start Date</a>
                    <i className="fa-solid fa-sort" onClick={() => requestSort('date')} style={{ cursor: 'pointer' }}></i> 
                </span>
             
            </th>
            <th >
                <span>
                    <a >End Date</a>
                    <i className="fa-solid fa-sort" onClick={() => requestSort('date')} style={{ cursor: 'pointer' }}></i> 
                </span>
              
            </th>
            <th >
                <span>
                    <a >Status</a>
                    <i className="fa-solid fa-sort" onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}></i> 
                </span>   
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data ? data.map((booking, index) => (
            <tr key={`${booking.id}-${index}`}>
              <td>{booking.uniqueVehicle.vehicle.name}</td>
              <td>{booking.uniqueVehicle.vehicle.model}</td>
              <td>{booking.uniqueVehicle.vehicle.manufacture}</td>
              <td>{booking.startDate}</td>
              <td>{booking.endDate}</td>
              <td>{booking.status}</td>
              <td className={styles.action}>
                {booking.status === 'Returned' ? (
                  <span className={styles.actionItem}>
                    <i className="fa-solid fa-retweet" title="book again"></i>
                    <a>Book again</a>
                  </span>
                ) : booking.status === 'Booked' ? (
                 <>
                     <span className={styles.actionItem}>
                        <i className="fa-solid fa-xmark" title="cancel"></i>
                        <a>Cancel</a>
                    </span>
                    <span className={styles.actionItem}>
                        <i className="fa-solid fa-retweet" title="extend"></i>
                        <a>Extend</a>
                    </span>
                 </>
                ) : (
                  <>
                    <span className={styles.actionItem}>
                      <i className="fa-regular fa-share-from-square" title="return"></i>
                      <a>Return</a>
                    </span>
                    <span className={styles.actionItem}>
                      <i className="fa-solid fa-retweet" title="extend"></i>
                      <a>Extend</a>
                    </span>
                  </>
                )}
              </td>
            </tr>
          )):<></>}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
