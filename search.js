const localData = JSON.parse(localStorage.getItem('data'));
const searchData = JSON.parse(localStorage.getItem('searchDetails'));
const resultArr = localData.results;

var city = searchData.location;
city = city[0].toUpperCase() + city.slice(1);

document.querySelector('#loc').innerText = city;
document.querySelector('#date').innerText = searchData.date;
document.querySelector('#guest').innerText = searchData.guest + " guests";
document.querySelector('#stays').innerText = `${localData.results.length} stays in ${city}`;


function fav(img) {
    this.addEventListener("click", () => {
        if (img.getAttribute("src") === "icons/fav.svg") {
            img.setAttribute("src", "icons/fav_red.svg");
        } else {
            img.setAttribute("src", "icons/fav.svg");
        }
    
    });
}




const cardContainer = document.getElementById("container");

let locations = [];
let userLoc = {};
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        userLoc.latitude = position.coords.latitude;
        userLoc.longitude = position.coords.longitude;
        // setDistance();
    });
} else {
    console.log('no-geolocation');
}

makeListingCards();


function addColor(event) {
    if (event.target.style.color === 'red') {
        event.target.style.color = 'black';
    } else {
        event.target.style.color = 'red';
    }
}

function makeAmenities(arr) {
    return arr.join('&nbsp;·&nbsp;');
}


function makeListingCards() {
    resultArr.forEach(result => {
        let sampleCards = `
        <div class="image">
        <img src="${result.images[0]}"
            alt="">
    </div>

    <div class="breif">
        <div class="para-1">
            <div>
                <p class="para-1-1">${result.type +' in '+ city}</p>
                <p class="para-1-2">${result.name}</p>
            </div>
            <img onclick="fav(this)" src="icons/fav.svg" alt="">
        </div>

        <div>
            <p class="para-1-1">${result.persons +' guests'} · ${result.type} · ${result.beds +' beds'} · ${result.bathrooms +' bath'}</p>
            <p class="para-1-1">${makeAmenities(result.previewAmenities)}</p>
        </div>

        <div class="para-3">
            <div class="para-3-1">
                <p class="para-3-1-1">${result.rating}</p>

                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                    fill="none">
                    <path
                        d="M10 3.95825L11.4583 8.54158H16.0417L12.2917 11.4583L13.5417 16.0416L10 13.1249L6.45834 16.0416L7.70834 11.4583L3.95834 8.54158H8.54168L10 3.95825Z"
                        fill="#FCD34D" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>

                <p class="para-3-1-2">(${result.reviewsCount +' reviews'})</p>
            </div>

            <div class="para-3-2">
                <p class="para-3-2-1">${result.price.priceItems[0].title.split(' x ')[0]}</p>
                <p class="para-3-2-2">/night</p>
            </div>
        </div>

    </div>`;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = sampleCards;
        locations.push([result.name, result.lat, result.lng]);

        card.onclick = () => {
            if (localStorage.getItem('roomId')) {
                localStorage.removeItem('roomId');
            }
            localStorage.setItem('roomId', JSON.stringify({ 'id': result.id, 'price': result.price, 'result': { result } }));
            window.location.href = 'rooms.html';
        }

        cardContainer.appendChild(card);
    });

}


var map = L.map('map').setView([locations[0][1], locations[0][2]], 8);
mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 500,
}).addTo(map);

for (var i = 0; i < locations.length; i++) {
    marker = new L.marker([locations[i][1], locations[i][2]])
        .bindPopup(locations[i][0])
        .addTo(map);
}

function getDistance(source, destination) {
    // return distance in meters
    var lon1 = toRadian(source[1]),
        lat1 = toRadian(source[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return Math.round(c * EARTH_RADIUS * 1000);
}
function toRadian(degree) {
    return degree * Math.PI / 180;
}

function setDistance() {
    let i = 0;
    document.querySelectorAll('.distance').forEach((ele) => {
        var distance = getDistance([userLoc.latitude, userLoc.longitude], [locations[i][1], locations[i][2]]);
        ele.innerText = `Distance from you : ${distance} km`;
        i++;
    })
}