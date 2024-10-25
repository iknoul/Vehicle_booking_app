'use client'
import { Select, DatePicker, Button, notification } from 'antd';
import styles from './bookingInputs.module.css'

interface BookingInputsProps{
    id?:string,
    model?: string,
    startDate: Date | null,
    setStartDate: Function,
    setEndDate: Function,
    setLocation: Function,
    endDate: Date | null,
    location: string,
    handleSubmit: Function
}
const  BookingInputs:React.FC<BookingInputsProps> = ({id, model, startDate, setStartDate, endDate, setEndDate, location, setLocation, handleSubmit}) =>{



  const handleNext = () => {
    // Get current date
    const currentDate = new Date();

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
    // Check if startDate is after currentDate
    if (startDate <= currentDate) {
        notification.error({
          message: 'Validation Error',
          description: 'Start date must be after the current date.',
        });
        return;
    }

    // Proceed to the next step
    console.log('Proceeding to the next step...');
    handleSubmit()
  };
    return(
    <div className={styles.bookingInputsContainer}>
        <div className={styles.bookInputHead}>
            <h3>Rent the {model}</h3>
        </div>
        <DatePicker
        className={styles.input}
        placeholder="Select Start Date"
        value={startDate}
        onChange={(date) => setStartDate(date ? date : null)} // Convert moment object to Date
        />
        <DatePicker
            value={endDate}
            className={styles.input}
            placeholder="Select End Date"
            onChange={(date) => setEndDate(date ? date : null)} // Convert moment object to Date
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
    </div>)
}

export default BookingInputs