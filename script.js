let ukCloseBtn = $(".uk-offcanvas-close");
let form = $("form");
const apiKey = "6ae39a495699948a3a6ccf26e9ec4520"

$(window).on("load", getWeather);

function buildUrl(callType,params) {
    let urlBase = "https://api.openweathermap.org/data/2.5/";
    let weatherUrl = urlBase + callType + "?" + $.param(params);
    return weatherUrl;
}

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

function buildForecastBody(index,dataForecastRow, forecastStats) {
    console.log(index);
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


    let forecastIconImg = $("<img class='forecast-weather-icon uk-border-rounded' width='45' height='45'>");
    let forecastIcon = forecastStats[index]["Icon"];
    forecastIconImg.attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
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

function setForecast(forecastData) {
    console.log(forecastData);
    console.log(forecastData.current);
    let date = moment.unix(forecastData.current.dt).format("LL");
    let iconImg = $("<img class='current-weather-icon uk-border-rounded' width='45' height='45'>");
    let icon = forecastData.current.weather[0].icon;
    iconImg.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
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
    $.each(currentStats, function(index,value) {
        $(".current-body").append($("<p>" + index + ": " + value + "</p>"));
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
    console.log(forecastStats);
    // let forecastElements = setForecastBody();
    // console.log(forecastElements);
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



    // let forecastCards = $(".forecast-title-dt");
    // $.each(forecastCards, function(index,value) {
    //     let forecastBody = $(value).siblings(".forecast-body");
    //     forecastBody.empty();
    // });
    // console.log(forecastCards);
    // $.each(forecastCards, function(index,value) {
    //     let forecastIconImg = $("<img class='forecast-weather-icon' width='45' height='45'>");
    //     let forecastIcon = forecastStats[index + 1]["Icon"];
    //     forecastIconImg.attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
    //     let h3El = $(value).children("h3");
    //     // let forecastBody = $(value).siblings(".forecast-body");
    //     h3El.text(forecastStats[index + 1]["Date"]);
    //     h3El.append(forecastIconImg);
    //     // forecastBody.append($("<p>" + "High: " + forecastStats[index + 1]["High"] + "</p>"));
    //     // forecastBody.append($("<p>" + "Low: " + forecastStats[index + 1]["Low"] + "</p>"));
    //     // forecastBody.append($("<p>" + "Humidity: " + forecastStats[index + 1]["Humidity"] + "</p>"));
    //     // forecastBody.append($("<p>" + "Wind Speed: " + forecastStats[index + 1]["Wind Speed"] + "</p>"));
    // });
  
    $(".current-weather").css("display", "block");
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
    let city = $("#city").val().trim().toUpperCase();
    let params = {q: city, appid: apiKey};
    let weatherUrl = buildUrl(callType,params);
    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(getForecast);
    ukCloseBtn.click()
}

form.submit(getWeather);