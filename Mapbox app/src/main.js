import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js";
import * as admin from "./parks-viewer.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;

//favorites array
let favoriteIds = [];
let currentId;


// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatNYS);
	}

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatNYS);
	}

	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	}

	refreshFavorites();

}

//get the id
const getFeatureByID = (id) => {
	return geojson.features.find(feature => feature.id == id);
}

//show page details
const showFeatureDetails = (id) => {
	//console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureByID(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `<b>Address: </b> ${feature.properties.address} <br> <b>Phone: </b> ${feature.properties.phone} <br> <b>Website</b> <a href="${feature.properties.url}">${feature.properties.url}</a>`;
	document.querySelector("#details-3").innerHTML = feature.properties.description

	//show buttons
	document.querySelector("#buttons").style.display = "block";

	//get the current id
	currentId = id;

	changeButtonStates();
};

//refresh the favorites
const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
}

//create favorites
const createFavoriteElement = (id) => {
	const feature = getFeatureByID(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	}
	a.innerHTML = ` 
	<span class="panel-icon">
	<i class="fas fa-map-pin"></i>
	</span>
	${feature.properties.title}`;
	return a;
}

//disable and enable buttons
const changeButtonStates = () => {
	if (favoriteIds.includes(currentId)) {
		favoriteButton.disabled = true;
		deleteButton.disabled = false;
	} else {
		favoriteButton.disabled = false;
		deleteButton.disabled = true;
	}
}

//get array from local storage
const loadLocalStorage = () => {
	const storedList = storage.readFromLocalStorage("favorites")

	//if array is full
	if (Array.isArray(storedList)) {
		favoriteIds = storedList

	}
	//if empty
	else {
		favoriteIds = [];
	}

}

//BUTTON EVENTS
//favorite button
const favoriteButton = document.querySelector("#btn-fav");
favoriteButton.addEventListener("click", () => {

	if (favoriteIds.length > 0) {
		//search for duplicate
		for (let i = 0; i < favoriteIds.length; i++) {
			//leave loop if there is a duplicate
			if (currentId === favoriteIds[i]) {
				break;
			}
			//only add it once
			if (i === favoriteIds.length - 1) {
				//console.log("not yet added")
				favoriteIds.push(currentId);
			}
		}
	} else {
		favoriteIds.push(currentId);
	}

	refreshFavorites();
	changeButtonStates();

	storage.writeToLocalStorage("favorites", favoriteIds);

	const feature = getFeatureByID(currentId);
	admin.writeFavNameData(feature.properties.title, currentId, 1);


	

	

})
//delete button
const deleteButton = document.querySelector("#btn-delete");
deleteButton.addEventListener("click", () => {

	//search for duplicates
	for (let i = 0; i < favoriteIds.length; i++) {
		//if one exists
		if (currentId === favoriteIds[i]) {
			favoriteIds.splice(i, 1);

		}
	}

	refreshFavorites();
	changeButtonStates();

	storage.writeToLocalStorage("favorites", favoriteIds);

	const feature = getFeatureByID(currentId);
	admin.writeFavNameData(feature.properties.title, currentId, -1);



})

const init = () => {
	loadLocalStorage();
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		//	console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	})
};

init();