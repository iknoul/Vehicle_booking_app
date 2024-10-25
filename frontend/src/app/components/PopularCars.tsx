
import { useEffect, useState } from 'react'
import VehicelCard from '../theme/VehicelCard'
import styles from './styles/popularCars.module.css'
import { useFetchVehicles } from '../hooks/vehicleHooks/useFetchVehicles'



const PopularCars:React.FC = ()=>{

    const { vehicles, loading: vehiclesLoading, refetch, error: fetchError } = useFetchVehicles({limit:3});


    const handleFetchVehicles = async ()=>{
        try {
            // const data = await fetchVehicles()
            // setCarData(data)
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        try {
            handleFetchVehicles()
        } catch (error) {
            
        }
    })

    return(
    <div className={styles.carContainer}>
        {vehicles ?
            vehicles.map((item, index)=>{
                return(<VehicelCard key={item.id} carData={item}/>)
            })
            :
            <></>
        }
    </div>)
}

export default PopularCars