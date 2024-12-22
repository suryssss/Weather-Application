const cityInput=document.querySelector(".search")
const searchBtn=document.querySelector(".searchBtn")
const weatherInfoSection=document.querySelector(".weather-infos")
const notFoundText=document.querySelector(".errorText")
const citySelection=document.querySelector(".frontpage")
const cityName=document.querySelector(".cityname")
const tempValue=document.querySelector(".value")
const conditionTxt=document.querySelector(".condition")
const humidValueTxt=document.querySelector(".humidValue")
const windValueTxt=document.querySelector(".windValue")
const weatherCondIcon=document.querySelector(".weatherConditionIcon")
const dateTime=document.querySelector(".date-heading")
const countryVal=document.querySelector(".country")

const foreCastContainer=document.querySelector(".box-container")

const apiKey= '39c7f73eb5aaae6400889c910e04da0a'

const countryMapping = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'IT': 'Italy',
    'ES': 'Spain',
    'IN': 'India',
    'JP': 'Japan',
    'BR': 'Brazil',
};

const weatherBackgrounds = {
    Clear: "url('sunny2.png')",
    Clouds: "url('cloudy.png')",
    Rain: "url('rainy.png')",
    Snow: "url('snow.png')",
    Thunderstorm: "url('thunder.png')",
    Drizzle: "url('rainy.png')",
    Fog: "url('mist.png')",
};





searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim() !='') {
        weatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown',(event)=>{
    if (event.key== 'Enter'&&
        cityInput.value.trim() !=''
    ) {
        weatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})

async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getWeatherIcon(id){
    if (id<=232) return 'thunder.svg'
    if (id<=321) return 'drizzle.svg'
    if (id<=531) return 'rainy.svg'
    if (id<=622) return 'snowy.svg'
    if (id<=800) return 'sunnyIcon.svg'
    if(id==721) return 'haze.png'
    else return 'cloudy.svg'
}

function getCurrentDate(){
    const dateElement=document.querySelector(".date")
    const dayElement=document.querySelector(".day")

    const currentDate =new Date()
        const day =currentDate.toLocaleDateString('en-GB',{weekday:'long'})
        const date=currentDate.toLocaleDateString('en-GB',{day:'numeric'})
        const month=currentDate.toLocaleDateString('en-GB',{month:'long'})


        dateElement.textContent = `${date}, ${month}`;
        dayElement.textContent=day

        dayElement.style.marginTop="-3px"
}


 async function weatherInfo(city){
        const weatherData = await getFetchData('weather', city);

        if (weatherData.cod != 200) {
            displaySection(notFoundText); 
            return 
        }

        console.log(weatherData)

        const{
            name:cityVal,
            sys: {country},
            main:{temp,humidity},
            weather:[{id,main }],
            wind:{speed}
            
        }=weatherData

        cityName.textContent = cityVal
        countryVal.textContent = countryMapping[country] || country
        tempValue.textContent = Math.round(temp) +' °C'
        conditionTxt.textContent = main
        humidValueTxt.textContent=humidity +' %'
        windValueTxt.textContent=(speed * 3.6).toFixed(1) + ' kmph'

        getCurrentDate()
        weatherCondIcon.src=`./images/${getWeatherIcon(id)}`

        updateBackground(main)

        await forecastUpdates(city)
        displaySection(weatherInfoSection)
}

function updateBackground(weatherType) {
    const body = document.body;
    const background = weatherBackgrounds[weatherType] || "url('default-background.jpg')"; 
    body.style.backgroundImage = background;
}





async function forecastUpdates(city){
    const foreCastData= await getFetchData("forecast",city)

    const timeTaken= '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    let forecastDaysCount = 0

    foreCastContainer.innerHTML =''
    for (const forecastsWeather of foreCastData.list) {
        if (forecastsWeather.dt_txt.includes(timeTaken) &&
            !forecastsWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastsWeather);
            forecastDaysCount++;

            if (forecastDaysCount === 7) break;
        }
    }
}

function updateForecastItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt:date,
        weather:[{id,main}],
        main :{temp}
    } =weatherData

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short'
    })

    const forecastItems = `
           <div class="box-item">
                <p class="date-text">${formattedDate}</p>
                <div class="box">
                    <p class="boxText"> ${main} <br></p>
                    <img class="imgIcon" src="./images/${getWeatherIcon(id)}">
                    <p class="tempText">${Math.round(temp)}°C</p>
            </div>
    `
    foreCastContainer.insertAdjacentHTML('beforeend',forecastItems)

}
 function displaySection(section){
    [weatherInfoSection, citySelection, notFoundText]
    .forEach(section => section.style.display = 'none');

    section.style.display = 'block';
 }