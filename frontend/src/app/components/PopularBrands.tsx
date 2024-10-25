import styles from './styles/popularBrands.module.css'
import Image from 'next/image'

interface CarBrand{
    carBrand: String[]
}

const carBrands = [
    '/asset/landingPage/popularBrands/BMW.svg',
    'asset/landingPage/popularBrands/Mercedes-Benz_free_logo.svg',
    'asset/landingPage/popularBrands/Nissan_2020_logo.svg',
    'asset/landingPage/popularBrands/Suzuki_logo_2 1.svg',
    'asset/landingPage/popularBrands/Toyota_EU 1.svg',
    'asset/landingPage/popularBrands/Vector.svg',
    'asset/landingPage/popularBrands/Volvo_logo1 1.svg',
    'asset/landingPage/popularBrands/image 262.svg'

]


const PopularBrands = ()=>{

        return(
        <div className={styles.popularBrands}>
            {carBrands.map((item, index)=>{
                return(
                <Image
                    key={index}
                    src={item}
                    alt={item}
                    width={100}
                    height={100}
                />)
            })}
        </div>
        )
}

export default PopularBrands