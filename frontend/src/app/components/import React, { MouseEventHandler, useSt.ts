import React, { MouseEventHandler, useState } from 'react';
import styles from './styles/searchBar.module.css';
import { DatePicker, Input, Button } from 'antd';
// import moment from 'moment';

interface MyProps{
    searchQuery: string ,
    vehicleType: string,
    startDate: any,
    endDate: any;
    setSearchQuery: Function,
    setVehicleType: Function,
    setStartDate: Function,
    setEndDate: Function,
    handleSearch:MouseEventHandler<HTMLElement>,
    setViewAll:  React.Dispatch<React.SetStateAction<boolean>>,
}
const SearchBar:React.FC<MyProps> = ({searchQuery, setSearchQuery, startDate, setStartDate, endDate, setEndDate, handleSearch, setViewAll}) => {

const handleSearchAll = ()=>{
  setViewAll((prevState)=>!prevState)
}

const handleOnChange = (item: 'Start date' | 'End date' | 'query', value:string)=>{
  setViewAll(false)
  switch(item){
    case 'Start date':
      setStartDate(value)
      break;
    case 'End date':
      setEndDate(value)
      break;
    case 'query':
      setSearchQuery(value)
      break;
  }
}
  

  return (
    <div className={styles.searchBar}>
      <DatePicker
        placeholder="Start date"
        value={startDate}
        onChange={(date) => handleOnChange('Start date', date)}
        className={styles.datePicker}
      />
      <DatePicker
        placeholder="End date"
        value={endDate}
        onChange={(date) => handleOnChange('End date', date)}
        className={styles.datePicker}
      />
      <Input
        placeholder="Search with any keyword"
        value={searchQuery}
        onChange={(e) => {handleOnChange('query', e.target.value)
        }}
        className={styles.input}
      />
      <Button 
        onClick={handleSearch} 
        className={styles.button}
        danger>
          <i className="fa-solid fa-magnifying-glass"></i>
      </Button>
      <Button 
        onClick={handleSearchAll} 
        className={styles.button}
        type='text'>
          View All
      </Button>
 </div>
  );
};

export default SearchBar;
