
import styled from '@emotion/styled';
import WeatherCard from './views/WeatherCard';
import { getMoment } from './utils/helpers';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/weatherSetting';
import { useState } from 'react';


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
  const [currentPage, setCurrentPage] = useState('WeatherCard')
  const [weatherElement,fetcData] = useWeatherAPI({
    locationName:LOCATIONT_NAME, cityName:LOCATIONT_NAME_FORCAST,
    authorizationKey:AUTHORIZATION_KEY
  })
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage)
  }
  
  
  
  
  
  
  const moment=getMoment(LOCATIONT_NAME_FORCAST);


  return (
    <Container>
      {currentPage === 'WeatherCard' &&(
        <WeatherCard weatherElement={weatherElement} 
        moment={moment} 
        fetcData={fetcData} 
        handleCurrentPageChange={handleCurrentPageChange}/>
      )}
      {currentPage === 'WeatherSetting' && 
      <WeatherSetting handleCurrentPageChange={handleCurrentPageChange}/>}
    </Container>
  );
};

export default App;
