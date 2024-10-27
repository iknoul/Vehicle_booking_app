'use client'
import { ApolloProvider } from '@apollo/client';
import client from '../../apollo/apolloClient';  // Import Apollo Client
import HeroSection from './components/HeroSection';
import PopularBrands from './components/PopularBrands';

import PopularCars from './components/PopularCars';
import CtaSection from './components/CtaSection';
import SearchBar from './components/SerchBar';
import SeachCarResults from './components/SearchCarResults';
import Loader from './components/Loader';
import LoaderContainer from './components/LoaderContainer';

import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { usePageLoading } from './hooks/pageLoadingHook/usePageLoadingHook';
import styles from "./page.module.css";




export default function Home() {

  const {isPageLoading} = usePageLoading()
    // State to hold input values
    const [searchQuery, setSearchQuery] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [filter, setFilter] = useState(false)
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);

  
  const [showCard, setShowCard] = useState(false)
  const [viewAll, setViewAll] = useState(false)

  // Handle search button click
  const handleSearch = () => {
    // Format date to string if selected, else leave as null
    // const formattedStartDate = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    // const formattedEndDate = endDate ? moment(endDate).format('YYYY-MM-DD') : null;
    // Log or use the data (e.g., make an API call)
    console.log('Model Name:', searchQuery);
    console.log(startDate,"start", endDate, "here the dates")
    // setShowCard (prevState =>!prevState)
    if((searchQuery || startDate || endDate || vehicleType)){
      console.log('her insdei oprrtion')
      setShowCard(true)
      setTimeout(()=>{console.log(searchQuery ,startDate , endDate , vehicleType,"kkk", showCard,viewAll, 'modelName startDate ed vetype showcrd viewall')}, 2000)
    }
    else{
      setShowCard(false)
    }
    // console.log('Start Date:', formattedStartDate);
    // console.log('End Date:', formattedEndDate);

    // Perform your search or API call here
    // For example: fetch data from an API based on these inputs
  };
  useEffect(()=>{
    console.log(isPageLoading, 'here the page loading')
  }, [isPageLoading])
  
  return (
    <ApolloProvider client={client}>
      <LoaderContainer isLoading={isPageLoading} spinner={<Loader />}>
        <HeroSection />
        <div className={styles.bodyContainer}>
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            vehicleType={vehicleType}
            setVehicleType = {setVehicleType}
            startDate={startDate} 
            endDate={endDate} 
            setStartDate={setStartDate} 
            setEndDate={setEndDate} 
            handleSearch={handleSearch}
            setViewAll={setViewAll}
            filter={filter}
            setFilter={setFilter}
          />
            
            {(showCard && (searchQuery || startDate || endDate || vehicleType)) || viewAll ? (
                <SeachCarResults 
                    searchQuery={searchQuery}
                    startDate={startDate}
                    endDate={endDate}
                    filter={filter}
                />
            ) : null}

          <PopularBrands />
          <PopularCars />
        </div>
        <CtaSection />
      </LoaderContainer>
    </ApolloProvider>
  );
}





