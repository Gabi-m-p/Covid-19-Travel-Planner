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
    
    var country_name = document.querySelector(".country_input").value
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
    .then(function(data) {
	    console.log(data);

        //Display total cases
        document.querySelector(".covid_cases_content").innerHTML = data[0].confirmed.toString(); 

        //Display total recoveries 
        document.querySelector(".recoveries_content").innerHTML = data[0].recovered.toString(); 

        //Display total critical cases 
        document.querySelector(".critical_content").innerHTML = data[0].critical.toString(); 

        //Display total deaths 
        document.querySelector(".deaths_content").innerHTML = data[0].deaths.toString(); 


    })
    .catch(err => {
	console.error(err);
    });
}


document.querySelector("#country_form").addEventListener('submit', country_data);
