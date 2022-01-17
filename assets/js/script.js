/*
var headers = new Headers();
headers.append("Content-Type", "application/x-www-form-urlencoded");


fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers,
}).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);
});


fetch("https://test.api.amadeus.com/v1/duty-of-care/disease/covid19-area-report",{
    method:"GET",
    mode:"cors",
}).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);
});


fetch("https://www.covid19-api.com/country?name=China&format=json"
    , {
}).then(function (response) {
    return response.json();
}).then(function (data) {
    //console.log(data);
    console.log(data.country);

});

*/




function country_data (event) {
    event.preventDefault();
    
    var country_name = document.querySelector("#inputCityName").value
    var new_string = "https://www.covid19-api.com/country?name=" + country_name + "&format=json"
    
    fetch(new_string, {
	    "method": "GET",
	    "headers": {
		"x-rapidapi-host": "covid-19-data.p.rapidapi.com",
		"x-rapidapi-key": "7656eb3a5emsh21a5b41565b69d6p110da4jsn033e5b9f1a60"
	}
    })
    .then(function (response) {
        return response.json();
    })
    .then(function(c_data) {

        //Display total cases
        document.querySelector(".covid_cases_content").innerHTML = c_data[0].confirmed.toString(); 

        //Display total recoveries 
        document.querySelector(".recoveries_content").innerHTML = c_data[0].recovered.toString(); 

        //Display total critical cases 
        document.querySelector(".critical_content").innerHTML = c_data[0].critical.toString(); 

        //Display total deaths 
        document.querySelector(".deaths_content").innerHTML = c_data[0].deaths.toString(); 

        //insert data variables for lat and lon
        
        //EXTRACT LAT AND LONG, THEN PUT IN NEXT FETCH FUNCTION
        fetch_trip(c_data.lat, c_data.lon).then(function (data) {
            console.log(data);
        })    
    })
    .catch(err => {
	console.error(err);
    });
}


var apiKey = "5ae2e3f221c38a28845f05b67814a6c1ffdb743e584c4c5a2e935572"; 



sample_link = "https://api.opentripmap.com/0.1/en/places/geoname?name=China&apikey=5ae2e3f221c38a28845f05b67814a6c1ffdb743e584c4c5a2e935572"



sample_link_2 = "https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=144.90&lat=-37.8&apikey=5ae2e3f221c38a28845f05b67814a6c1ffdb743e584c4c5a2e935572"

function fetch_trip(lat, lon) {
    //pick up lat and lon inside this function
    return fetch(sample_link_2).then(function (response) {
    return response.json();
})
/*
.then(function (data) {
    //console.log(data);
    console.log(data);
});
*/
}



// document.querySelector("#country_form").addEventListener('submit', country_data);
document.querySelector("#searchBttn").addEventListener('click', country_data);


