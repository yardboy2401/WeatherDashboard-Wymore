//document ready on load function
$(document).ready(function () {
    //define global variables
  let contentEl = $("#theContent");
  let userQueryEl = $("#userQuery");
  let searchBtnEl = $("#searchBtn");
  let currentWeatherEl = $("#currentWeather");
  let extendedForecastEl = $("#extendedForecast");
  let locRequestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
  let localRequestUrlTwo = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiKey = "a4d4fbcf65c30db41df7a19f3e5dba8f&units=imperial";
  let searchHistoryEl = $("#searchHistory");
  let searchHistoryListEl = $("#searchHistoryList");

  //clears previous forecast data if present
  function clearWeatherData() {
    $("#weatherIconData").empty();
    $("#extWeatherIconData1").empty();
    $("#extWeatherIconData2").empty();
    $("#extWeatherIconData3").empty();
    $("#extWeatherIconData4").empty();
    $("#extWeatherIconData5").empty();
    $("#extendedForecastCard1").empty();
    $("#extendedForecastCard2").empty();
    $("#extendedForecastCard3").empty();
    $("#extendedForecastCard4").empty();
    $("#extendedForecastCard5").empty();
  }

    //API calls for forecast data-#1 for current weather and #2 for ext forecast data
  function fetchUserQuery(fetchRequestUrl) {
    fetch(fetchRequestUrl, {
      // options
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
          //adding current weather data and weather icon to page
        let currentDateTime = moment().format("dddd, MMMM Do, YYYY");
        currentWeatherEl.prepend($("<h2>").text("Date: " + currentDateTime));
        currentWeatherEl.prepend($("<h2>").text("City: " + data.city.name));
        currentWeatherEl.prepend($("<h2>").text("Current Weather"));
        var weatherIconData = $('<img id="weatherIconData">');
        weatherIconData.attr(
          "src",
          "http://openweathermap.org/img/w/" +
            data.list[0].weather[0].icon +
            ".png"
        );
        weatherIconData.appendTo($("#currentWeather"));
        currentWeatherEl.append(
          $("<h2>").text("Temp: " + data.list[1].main.temp + " deg F")
        );
        currentWeatherEl.append(
          $("<h2>").text("Wind: " + data.list[0].wind.speed + " MPH")
        );
        currentWeatherEl.append(
          $("<h2>").text("Humidity: " + data.list[0].main.humidity + " %")
        );
        let cityLat = data.city.coord.lat;
        let cityLon = data.city.coord.lon;
        let secondCurQuery =
          localRequestUrlTwo +
          "lat=" +
          cityLat +
          "&lon=" +
          cityLon +
          "&exclude=minutely,hourly&appid=" +
          apiKey;
        fetchUserQueryTwo(secondCurQuery);
      });

    function fetchUserQueryTwo(fetchRequestUrlTwo) {
      fetch(fetchRequestUrlTwo, {})
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          currentWeatherEl.append(
            $("<h2>")
              .text("UV Index: " + data.current.uvi)
              .attr("id", "uvi")
          );
            //changing UV Index font color based on severity of index number
          if (data.current.uvi <= 3) {
            $("#uvi").css({ color: "green", "font-weight": "bolder" });
          } else if (data.current.uvi > 3 && data.current.uvi <= 7) {
            $("#uvi").css({ color: "yellow", "font-weight": "bolder" });
          } else {
            $("#uvi").css({ color: "red", "font-weight": "bolder" });
          }
          //populating extended forecast cards data
          for (let i = 1; i < data.daily.length - 2; i++) {
            const element = data.daily[i];
            $("#extendedForecastCard" + [i]).prepend(
              $("<h2>").text(moment(data.daily[i].dt * 1000).format("MM/DD/YY"))
            );
            var extWeatherIconData = $('<img id="extWeatherIconData">');
            extWeatherIconData.attr("id", "extWeatherIconData" + [i]);
            extWeatherIconData.attr(
              "src",
              "http://openweathermap.org/img/w/" +
                data.daily[i].weather[0].icon +
                ".png"
            );
            extWeatherIconData.appendTo($("#extendedForecastCard" + [i]));
            $("#extendedForecastCard" + [i]).append(
              $("<h2>").text("Temp " + data.daily[i].temp.day + " deg F")
            );
            $("#extendedForecastCard" + [i]).append(
              $("<h2>").text("Wind: " + data.daily[i].wind_speed + " MPH")
            );
            $("#extendedForecastCard" + [i]).append(
              $("<h2>").text("Humidity: " + data.daily[i].humidity + "%")
            );
          }
        });
    }
  }

//display locally stored city data upon page load
  function displayLocalStorageCities() {
    searchHistoryListEl.html("");
    let searchedCities =
      JSON.parse(localStorage.getItem("searchedCities")) || [];
    searchedCities.forEach((searchedCities) => {
      let liEl = $("<li class='searchedCities'>");
      liEl.text(searchedCities);
      searchHistoryListEl.append(liEl);
    });
  }
  displayLocalStorageCities();

  //on click function for searched city history list
  $(document).on("click", ".searchedCities", function () {
    clearWeatherData();
    $(this).text();
    currentWeatherEl.css("display", "flex");
    extendedForecastEl.css("display", "block");
    currentWeatherEl.empty();
    let searchCity = locRequestUrl + $(this).text() + "&appid=" + apiKey;
    console.log(searchCity);
    fetchUserQuery(searchCity);
  });

  //get local storage city data
  function getLocalStorageCities() {
    let searchedCities =
      JSON.parse(localStorage.getItem("searchedCities")) || [];
    return searchedCities || [];
  }

  //search button click function setting displays creating api key and appending search to search history
  searchBtnEl.click(() => {
    clearWeatherData();
    currentWeatherEl.css("display", "flex");
    extendedForecastEl.css("display", "block");
    currentWeatherEl.empty();
    let curQuery = locRequestUrl + userQueryEl.val() + "&appid=" + apiKey;
    let searchedCities = getLocalStorageCities();
    if (
      !searchedCities ||
      !searchedCities.find((m) => m === userQueryEl.val().toLowerCase())
    ) {
      searchedCities.push(userQueryEl.val().toLowerCase());
      localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
      searchHistoryListEl.append(
        $("<li class='searchedCities'>").text(userQueryEl.val().toLowerCase())
      );
      userQueryEl.val("");
    }

    fetchUserQuery(curQuery);
  });
});
