'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";


// Dashboard component
const DashBoard = () => {

    const router = useRouter();
   // Redirect to the default view page when dashboard is loaded
   useEffect(() => {
    router.push('/DashBoard/view');
  }, [router]);


  return (
   <></>
  );
};

export default DashBoard;
