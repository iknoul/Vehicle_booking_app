'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";


// Dashboard component
const View = () => {

    const router = useRouter();
   // Redirect to the default view page when dashboard is loaded
   useEffect(() => {
    router.push('/DashBoard/view/BookPerVehicle');
  }, [router]);


  return (
   <></>
  );
};

export default View;
