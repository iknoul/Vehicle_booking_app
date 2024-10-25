import React, { MouseEventHandler } from 'react';
import { formatDate } from '../utils/formatDate';
import styles from './styles/searchBar.module.css';
import { DatePicker, Input, Button } from 'antd';

interface MyProps {
    searchQuery: string;
    vehicleType: string;
    startDate: any;
    endDate: any;
    setSearchQuery: Function;
    setVehicleType: Function;
    setStartDate: Function;
    setEndDate: Function;
    setFilter: React.Dispatch<React.SetStateAction<boolean>>;
    filter: Boolean;
    handleSearch: MouseEventHandler<HTMLElement>;
    setViewAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<MyProps> = ({
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleSearch,
    setViewAll,
    filter,
    setFilter
}) => {
    const handleSearchAll = () => {
        setViewAll((prevState) => !prevState);
    };

    const handleOnChange = (item: 'Start date' | 'End date' | 'query', value: any) => {
        setViewAll(false);
        switch (item) {
            case 'Start date':
                setStartDate(formatDate(value));
                break;
            case 'End date':
                setEndDate(formatDate(value));
                break;
            case 'query':
                setSearchQuery(value);
                break;
        }
    };

    const handleSetFilter = ()=>{
        setFilter(!filter)
    }

    

    // const handleSearchClick = () => {
    //     const formattedStartDate = formatDate(startDate);
    //     const formattedEndDate = formatDate(endDate);
    //     // Call your backend API with the formatted dates and other query parameters
    //     handleSearch({
    //         searchQuery,
    //         vehicleType: 'someType', // replace this with your actual vehicle type
    //         startDate: formattedStartDate,
    //         endDate: formattedEndDate,
    //     });
    // };

    return (
        <div className={styles.searchBar}>
            <span className={styles.datePickContiner}>
                <DatePicker
                    placeholder="Start date"
                    // value={startDate}
                    onChange={(date) => handleOnChange('Start date', date)}
                    className={styles.datePicker}
                />
                <DatePicker
                    placeholder="End date"
                    // value={endDate}
                    onChange={(date) => handleOnChange('End date', date)}
                    className={styles.datePicker}
                />
            </span>
            <Input
                placeholder="Search with any keyword"
                value={searchQuery}
                onChange={(e) => handleOnChange('query', e.target.value)}
                className={styles.input}
            />
            <Button 
                onClick={handleSearch} 
                className={styles.button}
                danger>
                <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
            <span style={{display:'flex', flexDirection:'column', justifyContent:"center", alignItems:'center', gap:'5'}}>
            <i className={`fa-solid fa-filter-circle-dollar ${styles.filter} ${filter ? styles.filtered : ''}`} onClick={handleSetFilter}></i>
            <Button 
                onClick={handleSearchAll} 
                className={styles.button}
                type='text'>
                View All
            </Button>
            </span>
        </div>
    );
};

export default SearchBar;
