import { useState, useEffect, useCallback } from 'react';
const fetchWeatherForcast = ({cityName, authorizationKey}) => {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
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
  
  const fetchCurrentWeather = ({locationName, authorizationKey}) => {
    console.log('fetchweather')
    console.log({locationName, authorizationKey})
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
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
const useWeatherAPI = ({locationName, cityName, authorizationKey}) => {
    console.log('api')
    console.log({locationName, authorizationKey, cityName})
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
      });
    
    const fetcData = useCallback(async ()=>{
        setWeatherElement((prevState) =>({
            ...prevState,
            isLoading: true
        }));
        const [currentWeather, weatherForcast] =await Promise.all([
            fetchCurrentWeather({locationName, authorizationKey}),
            fetchWeatherForcast({cityName, authorizationKey})
        ])
        console.log(currentWeather);
        console.log(weatherForcast);
        setWeatherElement({
            ...currentWeather,
            ...weatherForcast,
            isLoading:false
        })
    },[locationName, cityName, authorizationKey]);
    useEffect(()=>{
        console.log('use effect')
        fetcData();
        // fetchCurrentWeather()
        // fetchWeatherForcast()
      },[])
    return [weatherElement, fetcData]
};

export default useWeatherAPI;