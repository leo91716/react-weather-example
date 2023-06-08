
import styled from '@emotion/styled';
import WeatherCard from './views/WeatherCard';
import { getMoment } from './utils/helpers';
import useWeatherAPI from './hooks/useWeatherAPI';


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
  console.log('invoke funciotn component')
  const [weatherElement,fetcData] = useWeatherAPI({
    locationName:LOCATIONT_NAME, cityName:LOCATIONT_NAME_FORCAST,
    authorizationKey:AUTHORIZATION_KEY
  })
  
  
  
  
  
  
  const moment=getMoment(LOCATIONT_NAME_FORCAST);


  return (
    <Container>
      {console.log('render')}
      <WeatherCard weatherElement={weatherElement} moment={moment} fetcData={fetcData}/>
    </Container>
  );
};

export default App;
