
localStorage.clear();

document.getElementById("check_in").addEventListener("focusin", () => {
    document.getElementById("check_in").setAttribute("type", "date");
});

document.getElementById("check_out").addEventListener("focusin", () => {
    document.getElementById("check_out").setAttribute("type", "date");
});

document.getElementById("search").addEventListener("click", () => {
    localStorage.clear();
    
    var location = document.getElementById("location").value;
    var check_in = document.getElementById("check_in").value;
    var check_out = document.getElementById("check_out").value;
    var guests = document.getElementById("guests").value;

    if (location.value == "" || check_in == "" || check_out == "" || guests.value == "") {
        alert("Please provide all sections!");
    } else if ((new Date(check_in).getMonth()) !== (new Date(check_out).getMonth())) {
        alert("Both Check in and Check out date month should be same!");
    } else {
        fetchData(location, check_in, check_out, guests);
    }

});

async function fetchData(loc, checkIn, checkOut, guest) {
    guest = (guest == 0) ? 1 : guest;
    let cIn = new Date(checkIn);
    let cOut = new Date(checkOut);
    let month;
    switch (cOut.getMonth()) {
        case 1: month = 'Jan';
            break;
        case 2: month = 'Feb';
            break;
        case 3: month = 'March';
            break;
        case 4: month = 'April';
            break;
        case 5: month = 'May';
            break;
        case 6: month = 'June';
            break;
        case 7: month = 'July';
            break;
        case 8: month = 'Aug';
            break;
        case 9: month = 'Sep';
            break;
        case 10: month = 'Oct';
            break;
        case 11: month = 'Nov';
            break;
        default: month = 'Dec';
    }

    let str = month + ' ' + cIn.getDate() + " - " + cOut.getDate();

    const searchDetails = {
        'location': loc,
        'date': str,
        'guest': guest

    };
    const url = `https://airbnb13.p.rapidapi.com/search-location?location=${loc}&checkin=${checkIn}&checkout=${checkOut}&adults=${guest}&children=0&infants=0&pets=0&page=1&currency=INR`;
    console.log(url);
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'dde60befccmsh98d14f61f88db15p1ea8a5jsn4b25d8f726df',
            'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();

        localStorage.setItem("searchDetails", JSON.stringify(searchDetails));
        localStorage.setItem('data', result);

        var data = JSON.parse(result);
        if (data.message) {
            alert(data.message);
            window.open("/index.html", "_self");
        } else {
            window.open("/search.html", "_self");
        } 
    } catch (error) {
        console.error(error);
    }
}