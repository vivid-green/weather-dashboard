let ukCloseBtn = $(".uk-offcanvas-close");
let form = $("form");
const apiKey = "6ae39a495699948a3a6ccf26e9ec4520"

$(window).on("load", getWeather);

function buildUrl(callType,params) {
    let urlBase = "https://api.openweathermap.org/data/2.5/";
    let weatherUrl = urlBase + callType + "?" + $.param(params);
    return weatherUrl;
}

function setForecast(forecastData) {
    console.log(forecastData);
    console.log(forecastData.current);
    let date = moment.unix(forecastData.current.dt).format("LL");
    let iconImg = $("<img class='current-weather-icon' width='60' height='60'>");
    let icon = forecastData.current.weather[0].icon;
    iconImg.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
    let title = $(".current-title-dt h3");
    title.text($("#city").val());
    title.append(iconImg);
    $(".current-title").text(date);
    let currentStats = {
        "Temperature": (Math.floor((forecastData.current.temp - 273.15) * 9/5 + 32)) + "°F",
        "Humidity": forecastData.current.humidity + "%",
        "Wind Speed": forecastData.current.wind_speed + " MPH",
        "UV Index": forecastData.current.uvi
    };

    $(".current-body").empty();
    $.each(currentStats, function(index,value) {
        $(".current-body").append($("<p>" + index + ": " + value + "</p>"));
    });

    let forecastCards = $(".forecast-title-dt");

    $.each(forecastCards, function(index,value) {
        console.log(index,value);
    });
  
    $(".current-weather").css("display", "block");
    $(".forecast").css("display", "block");
}

function getForecast(weatherData) {
    let callType = "onecall"
    let params = {lat: weatherData.coord.lat, lon: weatherData.coord.lon, appid: apiKey};
    let weatherUrl = buildUrl(callType,params);
    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(setForecast);
}

function getWeather(event) {
    event.preventDefault();
    let callType = "weather"
    let params = {q: $("#city").val(), appid: apiKey};
    let weatherUrl = buildUrl(callType,params);
    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(getForecast);
    ukCloseBtn.click()
}

form.submit(getWeather);