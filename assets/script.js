var apiKey = '66e04496ee071e9632410ce91f6b0352';
var selectedCity = '';
var searchedCities = [];
var icon = $('<img>');
var currentCity = $('#city-name');

// Current date
var currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

currentCity.text(selectedCity);
$(document).ready(function () {
    history();

    // Users Searches are saved

    function history() {

        $('.list-group').empty();
        searchedCitiesString = localStorage.getItem('searchedCities');

        searchedCities = JSON.parse(searchedCitiesString);
        if (searchedCities === null) {
            searchedCities = [];
        }
        console.log(searchedCities);

        searchedCities.forEach(function (searchedCity) {
            var liElement = $('<li class=list-group-item>');
            liElement.addClass('city-list');
            liElement.text(searchedCity);   
        });
    };

    // Current Weather Data
    function weatherData(userCity) {

        var url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&APPID=${apiKey}&units=imperial`;

        currentCity.text(userCity + ' ' + currentDate + ' ');

        $.ajax({
            url: url,
            method: 'GET'
        }).done(function (response) {
            console.log('current city response', response);

            function currentWeather() {

                var iconcode = response.weather[0].icon;
                var iconurl = 'http://openweathermap.org/img/w/' + iconcode + '.png';
                icon.attr('src', iconurl);
                currentCity.append(icon);
                $('#city-temp').text('Temperature: ' + response.main.temp + '°F');
                $('#city-humidity').text('Humidity: ' + response.main.humidity + '%');
                $('#city-wind-speed').text('Wind Speed: ' + response.wind.speed);

            }

            var latitude = response.coord.lat;
            var longitude = response.coord.lon;

            var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&;lon=${longitude}&APPID=${apiKey}`;
            currentWeather();

            $.ajax({
                url: uvIndexUrl,
                method: 'GET'
            }).done(function (response) {
                console.log(response);
                $('#error').addClass('layout');
                $('#city-uv-index').text('UV Index: ' + response.value);
                $('#welcome').addClass('layout');
                $('#weather').removeClass('layout');

            });
        }).fail(function (error){
            $('#error').removeClass('layout');
            $('#welcome').addClass('layout');
            $('#weather').addClass('layout');
            $('#forecast').addClass('layout');
            $('#cards').addClass('layout');

            console.log('City does not exist', error);
        });

    // Five day forecast

    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${userCity}&mode=json&APPID=${apiKey}&units=imperial`;

        $.ajax({
            url: forecastUrl,
            method: 'GET'
        }).done(function (response) {
            console.log('forecast info', response);
            var j = 1;
            for (var i = 5; i < response.list.length; i = i + 8) {
                $('#day-' + j).text(response.list[i].dt_txt);
                var iconcode = response.list[i].weather[0].icon;
                var iconurl = 'http://openweathermap.org/img/w/' + iconcode + '.png';
                $('#icon-' + j).attr('src', iconurl);
                $('#temp-' + j).text('Temp: ' + response.list[i].main.temp + '°F');
                $('#humidity-' + j).text('Humidity: ' + response.list[i].main.humidity + '%');
                j++;
            }
            $('#error').addClass('layout');
            $('#forecast').removeClass('layout');
            $('#cards').removeClass('layout');
        });

    }

    $(document).on('click', '.city-list', function (event) {
        var buttonText = $(this).text();
        weatherData(buttonText);   
    });

    // click event for search btn
    $('#search-btn').on('click', function (event) {
        event.preventDefault();

        if ($('#searched-city').val() != '') {
            // get the value of the user's search
            city = $('#searched-city').val();

            // add searched city to searchedCities array
            searchedCities.push(city);
            localStorage.setItem('searchedCities', JSON.stringify(searchedCities));

            history();

            weatherData(city);
        }
        $('#searched-city').val('');
    });
});
