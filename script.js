const apiKey = "6ae39a495699948a3a6ccf26e9ec4520";
const url = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey;
let ukCloseBtn = $(".uk-offcanvas-close");
let form = $("form");
let city = $(".city");

form.submit(function(event) {
    event.preventDefault();
    ukCloseBtn.click();
    city = city.val();
    console.log(url + "&q=" + city);
    $.ajax({
        url: url + "&q=" + city,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    }).catch(function(error) {
        console.log(error);
    });
});