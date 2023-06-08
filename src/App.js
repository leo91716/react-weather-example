import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import WeatherCard from './views/WeatherCard';
import { getMoment } from './utils/helpers';


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
const AUTHORIZATION_KEY='CWB-65C6C2BE-3323-405E-8C03-1F0BEE3CA28D';
const LOCATIONT_NAME='臺北'
const LOCATIONT_NAME_FORCAST='臺北市'
const fetchWeatherForcast = () => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATIONT_NAME_FORCAST}`)
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
    console.log('fetchforcast')
    return {
      description: weatherElements.Wx.parameterName,
      weatherCode: weatherElements.Wx.parameterValue,
      rainPosibility: weatherElements.PoP.parameterName,
      comfortability: weatherElements.CI.parameterName
    }
  });
  
}

const fetchCurrentWeather = () => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATIONT_NAME}`)
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
    console.log('fetchweather')
    console.log({
      observationTime: locationData.time.obsTime,
      locationName: locationData.locationName,
      temperature: weatherElements.TEMP,
      windSpeed: weatherElements.WDSD,
      isLoading: false
    })
    return {
      observationTime: locationData.time.obsTime,
      locationName: locationData.locationName,
      temperature: weatherElements.TEMP,
      windSpeed: weatherElements.WDSD,
      isLoading: false
    }
  });
  
}

const App = () => {
  console.log('invoke funciotn component')
  
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
  
  const fetcData = useCallback(async ()=>{
    setWeatherElement((prevState) =>({
      ...prevState,
      isLoading: true
    }));
    const [currentWeather, weatherForcast] =await Promise.all([
      fetchCurrentWeather(),
      fetchWeatherForcast()
    ])
    console.log(currentWeather);
    console.log(weatherForcast);
    setWeatherElement({
      ...currentWeather,
      ...weatherForcast,
      isLoading:false
    })
  },[]);
  useEffect(()=>{
    console.log('use effect')
    fetcData();
    // fetchCurrentWeather()
    // fetchWeatherForcast()
  },[])
  
  const moment=getMoment(LOCATIONT_NAME_FORCAST);


  return (
    <Container>
      {console.log('render')}
      <WeatherCard weatherElement={weatherElement} moment={moment} fetcData={fetcData}/>
    </Container>
  );
};

export default App;
