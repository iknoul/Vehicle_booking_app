// types.ts

export interface Booking {
    createdDate: string;
    PeriodCount: number;
    carModel: string;
  }
  
  export interface CarBookings {
    carName: string;
    bookings: Booking[];
  }
  