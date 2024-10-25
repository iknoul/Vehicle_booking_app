'use client'
import { Select, DatePicker, Button, notification } from 'antd';
import { useState } from 'react';
import styles from './bookingInputs.module.css';

const vehicle = { name: 'c-class' };

const BookingInputs = () => {
  // State to hold the selected dates and location
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [location, setLocation] = useState<string>('Calicut');

  const handleNext = () => {
    // Validation logic
    if (!startDate || !endDate) {
      notification.error({
        message: 'Validation Error',
        description: 'Please select both start and end dates.',
      });
      return;
    }

    // Check if startDate is after endDate
    if (startDate > endDate) {
      notification.error({
        message: 'Validation Error',
        description: 'Start date cannot be after end date.',
      });
      return;
    }

    // Proceed to the next step
    console.log('Proceeding to the next step...');
  };

  return (
    <div className={styles.bookingInputsContainer}>
      <div className={styles.bookInputHead}>
        <h3>Rent the {vehicle.name}</h3>
      </div>
      <DatePicker
        className={styles.input}
        placeholder="Select Start Date"
        onChange={(date) => setStartDate(date ? date.toDate() : null)} // Convert moment object to Date
      />
      <DatePicker
        className={styles.input}
        placeholder="Select End Date"
        onChange={(date) => setEndDate(date ? date.toDate() : null)} // Convert moment object to Date
      />
      <Select
        className={styles.input}
        defaultValue={'Calicut'}
        onChange={(value) => setLocation(value)}
        options={[
          {
            value: 'Calicut',
            label: (
              <span className={styles.options}>
                <i className="fa-solid fa-location-dot"></i>
                <p>Calicut</p>
              </span>
            ),
          },
          // Add more location options if needed
        ]}
      />
      <Button className={styles.input} color='danger' onClick={handleNext}>
        Go Next
      </Button>
    </div>
  );
};

export default BookingInputs;
