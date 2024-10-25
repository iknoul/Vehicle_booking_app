// types.ts

export interface Booking {
    date: string; // YYYY-MM-DD format
    count: number; // Number of bookings on that date
    car: string;  // The car identifier (could be the car name or ID)
  }
  
  export interface CarBookings {
    carName: string;
    bookings: Booking[];
  }
  