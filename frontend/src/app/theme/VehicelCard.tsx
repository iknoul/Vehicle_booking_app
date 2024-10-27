'use client'
import Image from 'next/image'
import lineBreaker from '@/../public/asset/theme/pseudo.svg'
import { useState } from 'react'

import styles from './styles/vehicelCard.module.css'
import { useRouter } from 'next/navigation';
import { usePageLoading } from '../hooks/pageLoadingHook/usePageLoadingHook'



interface VehicleModel{
    model: string;
    manufacture: string;
    type: string;
}
interface Car{
    id: string;
    name?:string
    // vehicleModel?: VehicleModel
    model?:string
    type?:string;
    manufacture?:string;
    image?:string[]
    price?: number
    quantity?: number
}
interface Props{
    carData: Car
}
const VehicelCard:React.FC<Props> = ({carData}) =>{

    const router = useRouter()
    const {triggerTransition} = usePageLoading()
    const [currentIndex, setCurrentIndex] = useState(0);

    // Handler to go to the next image
    const handleNext = () => {
        if (carData?.image && currentIndex < carData.image.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Handler to go to the previous image
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    const bookVehicle = () => {
        triggerTransition(()=> router.push(`/Booking?id=${carData.id}&model=${carData.model}`))    
    }
    return(
        <div className={styles.vehicelCard}>
            <div className={styles.content}>
                <h3>
                    {carData.name}
                </h3>
                <h1>
                    {/* {carData.model} */}
                {carData.manufacture}&nbsp;
                 -&nbsp;{carData.model}
                </h1>
                <Image 
                    src={lineBreaker}
                    alt='line'
                />
            </div>
            {carData?.image &&
                 <div className={styles.carImage}>
                    <button 
                        className={`
                            ${styles.defaultArrow} 
                            ${(currentIndex > 0) && styles.leftArrow}`} 
                        onClick={handlePrevious} disabled={currentIndex === 0}>
                        <i className="fa fa-angle-left fa-lg" aria-hidden="true"></i>
                     </button>
                    <Image 
                        src={carData.image[currentIndex]} // Get the current image from the array
                        alt='Car image'
                        width={100}
                        height={100}
                    />
                    <button 
                        className={`
                            ${styles.defaultArrow} 
                            ${(currentIndex < carData.image.length - 1) && styles.rightArrow}`} 
                        onClick={handleNext} disabled={currentIndex === carData.image.length - 1}>
                        <i className="fa fa-angle-right fa-lg" aria-hidden="true"></i>
                     </button>
                 <div>     
                     
                 </div>
                </div>
            }
            <div className={styles.content}>
                <p>{carData.type}</p>
                <p>Price: ${carData.price}</p>

            </div>
            <button className={styles.button} onClick={bookVehicle}>RESERVE NOW</button>
        </div>)
}

export default VehicelCard
