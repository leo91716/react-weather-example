
import styled from '@emotion/styled';
import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/weatherSetting';
import { useState, useMemo } from 'react';
import { getMoment, findLocation } from './utils/helpers';


const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;



// const DayCloudy = styled(DayCloudyIcon)`
//   flex-basis: 30%;
// `;


const AUTHORIZATION_KEY='CWB-65C6C2BE-3323-405E-8C03-1F0BEE3CA28D';
const LOCATIONT_NAME='臺北'
const LOCATIONT_NAME_FORCAST='臺北市'


const App = () => {
  console.log('invoke function component')
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  
  const [currentCity, setCurrentCity] = useState(()=>localStorage.getItem('cityName') || '臺北市');
  const currentLocation = useMemo(()=>findLocation(currentCity), [currentCity])
  const {cityName, locationName, sunriseCityName} = currentLocation;
  
  const [weatherElement,fetcData] = useWeatherAPI({
    locationName, cityName,
    authorizationKey:AUTHORIZATION_KEY
  })
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage)
  }
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity)
  }
  const moment=useMemo(()=>getMoment(sunriseCityName), [sunriseCityName]);


  return (
    <Container>
      {currentPage === 'WeatherCard' &&(
        <WeatherCard weatherElement={weatherElement} 
        moment={moment} 
        fetcData={fetcData} 
        cityName={cityName}
        handleCurrentPageChange={handleCurrentPageChange}/>
      )}
      {currentPage === 'WeatherSetting' && 
      <WeatherSetting cityName={cityName}  handleCurrentPageChange={handleCurrentPageChange} handleCurrentCityChange={handleCurrentCityChange}/>}
    </Container>
  );
};

export default App;
