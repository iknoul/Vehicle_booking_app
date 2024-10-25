
import { useEffect, useState } from 'react'
import VehicelCard from '../theme/VehicelCard'
import styles from './styles/popularCars.module.css'
import { useFetchVehicles } from '../hooks/vehicleHooks/useFetchVehicles'
import { Empty } from 'antd'


interface SearchResultPrpos{
    searchQuery?: string
    startDate?: string
    endDate?: string
    filter?:boolean
} 

const SeachCarResults:React.FC<SearchResultPrpos> = ({searchQuery, startDate, endDate, filter})=>{
      // const [carData, setCarData] = useState<Object[]>([])
    const { vehicles, loading: vehiclesLoading, refetch, error: fetchError } = useFetchVehicles({
        searchQuery,
        startDate, 
        endDate,
        filter
    });


    const handleFetchVehicles = async ()=>{
        try {
            // const data = await fetchVehicles()
            // setCarData(data)
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        console.log(startDate, "here i print the start date to know which format")
        try {
            handleFetchVehicles()
        } catch (error) {
            
        }
    },[])

    return(
    <div className={styles.carContainer}>
        {vehicles&&vehicles.length>0?
            vehicles.map((item, index)=>{
                return <VehicelCard key={`${index}-${item.id}`} carData={item}/>
            })
        :
        <Empty />
        }
    </div>)
}

export default SeachCarResults