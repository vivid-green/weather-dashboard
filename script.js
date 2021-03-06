//Declaring variables for apikey, localstorage and storing jquery form and closebtn elements.
let ukCloseBtn = $(".uk-offcanvas-close");
let form = $("form");
let cityInput = $("#city");
const apiKey = "6ae39a495699948a3a6ccf26e9ec4520"
let cities = localStorage.getItem('cities');
cities = cities ? JSON.parse(cities) : {};

//On load invoke getWeather function to pull current and forecast weather via open weather api.
$(window).on("load", getWeather);

//Function to build url for api call.
function buildUrl(callType,params) {
    let urlBase = "https://api.openweathermap.org/data/2.5/";
    let weatherUrl = urlBase + callType + "?" + $.param(params);
    return weatherUrl;
}

//Function that builds object containing methods to create html elements with jquery.
function setForecastBody() {
    let forecastElements = {
        weatherHeader : function() { 
            return $("<h2 id='weather-header'>6 Day Forecast</h2>");
        },
        hr : function() {
            return $("<hr>");
        }, 
        rowGridDiv : function() {
            return $("<div class='uk-grid-small uk-child-width-expand@s uk-text-center uk-margin-small-bottom' uk-grid>");
        },
        cardContainerDiv : function() {
            return $("<div>");
        },
        gridContainerDiv : function() {
            return $("<div class='uk-grid-small uk-child-width-expand@s uk-text-center forecast-weather' uk-grid>");
        },
        cardDiv : function() {
            return $("<div class='uk-card uk-card-default uk-box-shadow-xlarge'>");
        },
        cardHeadDiv : function() {
            return $("<div class='uk-card-header'>");
        },
        cardGridDiv : function() {
            return $("<div class='uk-grid-small uk-flex-middle' uk-grid>");
        },
        titleDtDiv : function() {
            return $("<div class='uk-width-expand forecast-title-dt'>");
        },
        h3El : function() {
            return $("<h3 class='uk-card-title uk-margin-remove-bottom'>");
        },
        cardBodyDiv : function() {
            return $("<div class='uk-card-body forecast-body'>");
        },
    };
    return forecastElements;
}
//Function that sets all the html elements reference buy the function above that builds the object containing the methods to create html elements. 
function buildForecastBody(index,dataForecastRow, forecastStats) {
    let forecastElements = setForecastBody();
    let cardContainerDiv = $("<div>");
    let forecastRow = $("#forecast-row-" + dataForecastRow);
    forecastRow.append(cardContainerDiv);
    let gridContainerDiv = forecastElements.gridContainerDiv();
    cardContainerDiv.append(gridContainerDiv);
    let cardDiv = forecastElements.cardDiv();
    gridContainerDiv.append(cardDiv);        
    let cardHeadDiv = forecastElements.cardHeadDiv();
    cardDiv.append(cardHeadDiv);
    let cardGridDiv = forecastElements.cardGridDiv();
    cardHeadDiv.append(cardGridDiv);
    let forecastIconImg = $("<img class='forecast-weather-icon uk-border-rounded' width='45' height='45' alt='Weather Condition Icon'>");
    let forecastIcon = forecastStats[index]["Icon"];
    forecastIconImg.attr("src", "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
    let titleDtDiv = forecastElements.titleDtDiv();
    titleDtDiv.text(forecastStats[index]["Date"] + "  ");
    cardGridDiv.append(titleDtDiv);
    titleDtDiv.append(forecastIconImg);
    let cardBodyDiv = forecastElements.cardBodyDiv();
    cardDiv.append(cardBodyDiv);
    cardBodyDiv.append($("<p>" + "High: " + forecastStats[index]["High"] + "</p>"));
    cardBodyDiv.append($("<p>" + "Low: " + forecastStats[index]["Low"] + "</p>"));
    cardBodyDiv.append($("<p>" + "Humidity: " + forecastStats[index]["Humidity"] + "</p>"));
    cardBodyDiv.append($("<p>" + "Wind Speed: " + forecastStats[index]["Wind Speed"] + "</p>"));
}
//Function to dynamically create and append html elements to the DOM for 6 day weather forcast section of the DOM.
function setForecast(forecastData) {
    let date = moment.unix(forecastData.current.dt).format("LL");
    let iconImg = $("<img class='current-weather-icon uk-border-rounded' width='45' height='45' alt='Weather Condition Icon'>");
    let icon = forecastData.current.weather[0].icon;
    iconImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
    let title = $(".current-title-dt h3");
    let city = $("#city").val().trim().toUpperCase();
    title.text(city + "  ");
    title.append(iconImg);
    $(".current-title").text(date);
    let currentStats = {
        "Temperature": (Math.floor((forecastData.current.temp - 273.15) * 9/5 + 32)) + "°F",
        "Humidity": forecastData.current.humidity + "%",
        "Wind Speed": forecastData.current.wind_speed + " MPH",
        "UV Index": forecastData.current.uvi
    };

    $(".current-body").empty();
    let risk;
    $.each(currentStats, function(index,value) {
        if(index === "UV Index") {
            let val = value;
            if(val >= 8) {
                risk = "very-high";
            } else if(val > 5) {
                risk = "high"
            } else if(val > 2) {
                risk = "medium"
            } else {
                risk = "low"
            };

            $(".current-body").append($("<p>" + index + ": " + "<span class='uvi-" + risk + "'>" + value + "</span></p>"));
        } else {
            $(".current-body").append($("<p>" + index + ": " + value + "</p>"));
        }
    });

    let forecastStats = {};
    $.each(forecastData.daily, function(index,value) {
        if(index > 0 && index <= 6) {
            forecastStats[index] = {
                "Date": moment.unix(value.dt).format("LL"),
                "High": (Math.floor((value.temp.max - 273.15) * 9/5 + 32)) + "°F",
                "Low": (Math.floor((value.temp.min - 273.15) * 9/5 + 32)) + "°F",
                "Humidity": value.humidity + "%",
                "Wind Speed": value.wind_speed + " MPH",
                "Icon": value.weather[0].icon,
            };
        }
    });

    $(".forecast").empty();
    $.each(forecastStats,function(index,value) {
        if(index === "1" || index === "4") {
            let forecastDiv = $(".forecast");
            let rowGridDiv = $("<div class='uk-grid-small uk-child-width-expand@s uk-text-center uk-margin-small-bottom' id='forecast-row-" + index + "' uk-grid>");
            forecastDiv.append(rowGridDiv);
        };
       
        if(index < 4) {
            let dataForecastRow = "1";
            buildForecastBody(index,dataForecastRow,forecastStats);
        } else {
            let dataForecastRow = "4";
            buildForecastBody(index,dataForecastRow,forecastStats);
        }
    });
    $(".current-weather").css("display", "block");
}
//Function containing API call to open weather to obtain current and forecasted weather data.
function getForecast(weatherData) {
    let callType = "onecall"
    let params = {lat: weatherData.coord.lat, lon: weatherData.coord.lon, appid: apiKey};
    let weatherUrl = buildUrl(callType,params);
    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(setForecast);
}
//Function containing API call to get current weather data and pass params for the getForcast() function which is invoked in the api promise callback.
function getWeather(event) {
    event.preventDefault();
    let callType = "weather";
    let city = $("#city").val().trim().toUpperCase();
    let params = {q: city, appid: apiKey};
    let weatherUrl = buildUrl(callType,params);
    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(getForecast);

    let cleanCity = city.toLowerCase().replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-");
    cities[cleanCity] = city;
    localStorage.setItem('cities', JSON.stringify(cities));
    setNavCities();
    ukCloseBtn.click();
}
//Invoking function to populate previously searched city buttons in the nav.
setNavCities();
//Function to dynamically build previously searched cities from local storage.
function setNavCities() {
    let cities = JSON.parse(localStorage.getItem("cities"));
    let searchHistoryDiv = $("#search-history");
    searchHistoryDiv.empty();
    
    $.each(cities,function(index,value) {
        let prevCityBtn = $("<button class='uk-button uk-button-default uk-width-1-1 uk-text-left prev-cities'></button>");
        prevCityBtn.attr("id", index);
        let cityIcon = $("<i class='fas fa-city'></i>");
        prevCityBtn.text(value);
        // prevCityBtn.prepend(cityIcon);
        searchHistoryDiv.append(prevCityBtn);
    });
}
//Function to fire off search button to dynamically append DOM with dynamically created html elements based on API data when previously searched on city button is clicked.
function searchPrev(event) {
    let city = $("#city");
    city.val($(this).text());
    let submitBtn = $("#submitBtn");
    submitBtn.click();
};
//Event Listener to clear form input when clicked on to allow easy entry for another value.
form.submit(getWeather);
cityInput.click(function(event) {
    cityInput.val("");
});
//Event listener to fire off functionaly to dynamically append DOM with forecast API data when previously searched city buttons are clicked.
$(document).on("click",".prev-cities",searchPrev);