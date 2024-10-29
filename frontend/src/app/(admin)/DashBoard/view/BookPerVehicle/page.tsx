'use client';
import { lazy, Suspense } from "react";
import { Spin } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFetchPeriodByDate } from "@/app/hooks/adminHooks/useFetchPeriodByDate";
import styles from './bookPerVehicle.module.css'; // Import styles

// Lazy load D3Chart component
const BookingsChart = lazy(() => import('../components/D3Chart/D3Chart'));

interface PeriodData {
  createdDate: string; // Format 'YYYY-MM-DD' expected
  PeriodCount: number;
  carModel: string;
}

const DashBoard = () => {
  const { periodData, loading } = useFetchPeriodByDate();

  if (loading) {
    return <Spin />;
  }

  // Flatten and aggregate the data by date and car model
  const aggregatedData = periodData?.reduce((acc: any[], item: PeriodData) => {
    const existing = acc.find(d => d.createdDate === item.createdDate);
    if (existing) {
      existing[item.carModel] = (existing[item.carModel] || 0) + item.PeriodCount;
    } else {
      acc.push({ createdDate: item.createdDate, [item.carModel]: item.PeriodCount });
    }
    return acc;
  }, []) || [];

  // Get the unique list of car models for creating separate lines
  const carModels = Array.from(new Set(periodData.map(item => item.carModel)));

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bookings Chart</h2>
      <Suspense fallback={<Spin />}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            width={500}
            height={300}
            data={aggregatedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            {carModels.map(carModel => (
              <Line
                key={carModel}
                type="monotone"
                dataKey={carModel}
                name={carModel}
                stroke={getRandomColor()}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Suspense>
    </div>
  );
};

// Helper function for random colors
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default DashBoard;
