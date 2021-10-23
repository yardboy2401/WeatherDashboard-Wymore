let contentEl = $("#theContent");
let userQueryEl = $("#userQuery");
let searchBtnEl = $("#searchBtn");
let currentWeatherEl = $("#currentWeather")
let extendedForecastEl = $("#extendedForecast")
let locRequestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
let localRequestUrlTwo = "https://api.openweathermap.org/data/2.5/onecall?";
let apiKey = "a4d4fbcf65c30db41df7a19f3e5dba8f&units=imperial"
let searchHistoryEl = $("#searchHistory")
let searchHistoryList = $("#searchHistoryList")

function fetchUserQuery(fetchRequestUrl) {
    fetch(fetchRequestUrl, {
        // options
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            let currentDateTime = moment().format("dddd, MMMM Do, YYYY")
            currentWeatherEl.prepend($("<h2>").text("Date: " + currentDateTime));
            currentWeatherEl.prepend($("<h2>").text("City: " + data.city.name));
            currentWeatherEl.prepend($("<h2>").text("Current Weather"));
            currentWeatherEl.append($("<h2>").text("Temp: " + data.list[1].main.temp + " deg F"));
            currentWeatherEl.append($("<h2>").text("Wind: " + data.list[0].wind.speed + " MPH"));
            currentWeatherEl.append($("<h2>").text("Humidity: " + data.list[0].main.humidity + " %"));
            $("#weatherIconData").attr("src", "http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png");
            let cityLat = data.city.coord.lat;
            let cityLon = data.city.coord.lon;
            let secondCurQuery = localRequestUrlTwo + "lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly&appid=" + apiKey;
            // console.log(secondCurQuery) 
            fetchUserQueryTwo(secondCurQuery);
            
        });

        function fetchUserQueryTwo(fetchRequestUrlTwo) {
            fetch(fetchRequestUrlTwo, {
                // opt ions
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    
                    // contentEl.append($("<h2>").text("Lat: " + data.lat));
                    // contentEl.append($("<h2>").text("Lon: " + data.lon));
                    currentWeatherEl.append($("<h2>").text("UV Index: " + data.current.uvi));

                    for (let i = 1; i < (data.daily.length -2); i++) {
                        const element = data.daily[i];
                        $("#extendedForecastCard" + [i]).prepend($("<h2>").text(moment(data.daily[i].dt * 1000).format("MM/DD/YY")));
                        $("#extWeatherIconData" + [i]).attr("src", "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png");
                        $("#extendedForecastCard" + [i]).append($("<h2>").text("Temp " + data.daily[i].temp.day + " deg F"));
                        $("#extendedForecastCard" + [i]).append($("<h2>").text("Wind: " + data.daily[i].wind_speed + " MPH"));
                        $("#extendedForecastCard" + [i]).append($("<h2>").text("Humidity: " + data.daily[i].humidity + "%"));

                    }
                    
                });
        }
}

searchBtnEl.click(() => {
    currentWeatherEl.css("display", "flex");
    extendedForecastEl.css("display", "block");
    let curQuery = locRequestUrl + userQueryEl.val() + "&appid=" + apiKey
    console.log(curQuery);
    let searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
    searchedCities.push(userQueryEl.val());
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

    // localStorage.setItem("city", userQueryEl.val());
    // localStorage.setItem("searchedCities", JSON.stringify(["seattle", "portland", "wenatchee"]));
    // console.log(JSON.parse(localStorage.getItem("searchedCities")).push(userQueryEl.val()))
    $("#searchHistory").append($("<li>").text(userQueryEl.val()));
    // $(this).val(localStorage.getItem($(this).attr('searchedCities')))
    $('#userQuery').val("");
    fetchUserQuery(curQuery);
});


jQuery(document).ready(function() {
    $('#searchHistoryList').each(function() {
    $(this).val(localStorage.getItem($(this).attr('searchedCities')))
    // console.log($(this).val())
   })
})



// $.each(recentSearches, function (index, value) {
//     $('#searchHistory').append("<li class='historyItem'  onclick='addtotextbox("+index+")'>" + value + '</li>');
// });
// }

// function addtotextbox(id)
// {
// $('#textboxSearch').val(recentSearches[id]);
// }