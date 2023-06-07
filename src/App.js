import { useState, useEffect } from 'react';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import styled from '@emotion/styled';
import {ReactComponent as LoadingIcon} from './images/loading.svg'


const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration:${({isLoading})=>(isLoading?'1.5s':'0s')};
  }

  @keyframes rotate{
    from{
      transform: rotate(360deg);
    }
    to{
      transform: rotate(0deg);
    }
  }
`;

const App = () => {
  console.log('invoke funciotn component')
  const AUTHORIZATION_KEY='CWB-65C6C2BE-3323-405E-8C03-1F0BEE3CA28D';
  const LOCATIONT_NAME='臺北'
  const LOCATIONT_NAME_FORCAST='臺北市'
  const [weatherElement, setWeatherElement] = useState({
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPosibility: 0,
    observationTime: new Date(),
    isLoading: false, 
    comfortability: '',
    weatherCode: 0
  })
  const {
    locationName,
    description,
    windSpeed,
    temperature,
    rainPosibility,
    observationTime,
    isLoading,
    comfortability,
  }=weatherElement
  useEffect(()=>{
    console.log('use effect')
    fetchCurrentWeather()
    fetchWeatherForcast()
  },[])
  const fetchCurrentWeather = () => {
    setWeatherElement((prevState) =>({
      ...prevState,
      isLoading: true
    }))
    fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATIONT_NAME}`)
    .then((response)=>response.json())
    .then((data)=>{
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['WDSD','TEMP'].includes(item.elementName))
            neededElements[item.elementName]=item.elementValue;
            return neededElements;
        }
      )
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        isLoading: false
      }
      
      // setWeatherElement((prevState) =>({
      //   ...prevState,
      //   observationTime: locationData.time.obsTime,
      //   locationName: locationData.locationName,
      //   temperature: weatherElements.TEMP,
      //   windSpeed: weatherElements.WDSD,
      //   isLoading: false
      // }));
      
    });
    
  }

  const fetchWeatherForcast = () => {
    // setWeatherElement((prevState) =>({
    //   ...prevState,
    //   isLoading: true
    // }))
    fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATIONT_NAME_FORCAST}`)
    .then((response)=>response.json())
    .then((data)=>{
      const locationData = data.records.location[0];
      console.log(data)
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx','PoP','CI'].includes(item.elementName))
          {
            neededElements[item.elementName]=item.time[0].parameter;
            
          }
            
          return neededElements;
        },{}
      )
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPosibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      }
      // setWeatherElement((prevState)=>({
      //   ...prevState,
      //   description: weatherElements.Wx.parameterName,
      //   weatherCode: weatherElements.Wx.parameterValue,
      //   rainPosibility: weatherElements.PoP.parameterName,
      //   comfortability: weatherElements.CI.parameterName

      // }));
    });
    
  }
  return (
    <Container>
      {console.log('render')}
      <WeatherCard>
        <Location>{locationName}</Location>
        <Description>{description} {comfortability}</Description>
        <CurrentWeather>
          <Temperature>
          {Math.round(temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <DayCloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon /> {windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon /> {rainPosibility} %
        </Rain>
        <Refresh 
        onClick={()=>{
          fetchCurrentWeather();
          fetchWeatherForcast();
        }} 
        isLoading={isLoading}>
          最後觀測時間：
          {new Intl.DateTimeFormat('zh-TW',{
            hour:'numeric',
            minute: 'numeric'
          }).format(new Date(observationTime))} 
          {' '}
          {isLoading? <LoadingIcon/>: <RefreshIcon />}
        </Refresh>
      </WeatherCard>
    </Container>
  );
};

export default App;
