'use client';

import { lazy, Suspense } from "react";
import { Booking } from '../../types'; // Import your types
import { Spin } from "antd";


const BookingsChart = lazy(()=>import('../components/D3Chart/D3Chart'))

// Example booking data
const bookingsData: Booking[] = [
  { date: '2023-09-01', count: 10, car: 'Car A' },
  { date: '2023-09-01', count: 5, car: 'Car B' },
  { date: '2023-09-02', count: 20, car: 'Car A' },
  { date: '2023-09-02', count: 15, car: 'Car B' },
  { date: '2023-09-03', count: 15, car: 'Car A' },
  { date: '2023-09-04', count: 15, car: 'Car B' },
  { date: '2023-09-03', count: 10, car: 'Car C' },
  { date: '2023-09-04', count: 10, car: 'Car C' },
  { date: '2023-09-01', count: 10, car: 'Car A' },
  { date: '2023-09-01', count: 5, car: 'Car B' },
  { date: '2023-09-02', count: 20, car: 'Car A' },
  { date: '2023-09-02', count: 15, car: 'Car B' },
  { date: '2023-09-03', count: 15, car: 'Car A' },
  { date: '2023-09-04', count: 15, car: 'Car B' },
  { date: '2023-09-03', count: 10, car: 'Car C' },
  { date: '2023-09-04', count: 10, car: 'Car C' },
  { date: '2023-09-01', count: 10, car: 'Car A' },
  { date: '2023-09-01', count: 5, car: 'Car B' },
  { date: '2023-12-02', count: 20, car: 'Car A' },
  { date: '2024-09-02', count: 15, car: 'Car B' },
  { date: '2023-09-03', count: 15, car: 'Car A' },
  { date: '2023-09-04', count: 15, car: 'Car B' },
  { date: '2023-09-03', count: 10, car: 'Car C' },
  { date: '2024-09-04', count: 10, car: 'Car C' },

];

// Dashboard component
const DashBoard = () => {
  // Flatten the data and sum bookings by date
  const flattenedData = bookingsData.reduce((acc: Booking[], booking) => {
    // Format the booking date to your preferred format, e.g., 'YYYY-MM-DD'
   

    const existing = acc.find(d => d.date === booking.date && d.car === booking.car); // Check by formatted date and car
    if (existing) {
      existing.count += booking.count; // Sum bookings for the same date and car
    } else {
      acc.push({ date: booking.date, count: booking.count, car: booking.car });
    }
    return acc;
  }, []);


  return (
    <div>
      <h3>Bookings Chart</h3>
      <Suspense fallback="Loading ...">
        <BookingsChart data={flattenedData} />
      </Suspense>
    </div>
  );
};

export default DashBoard;
