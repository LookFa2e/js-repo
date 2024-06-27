// Initial points
const initialPoints = ["Point 1 ", "Point 2 ", "Point 3 ", "Point 4 ", "Point 5 ", "Point 6 ", "Point 7 ", "Point 8 ", "Point 9 ", "Point 10 "];
let points = [];
let markers = {};
let selectedPoint = null;

// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize marker cluster group
const markersGroup = L.markerClusterGroup();
map.addLayer(markersGroup);

// Add initial points to the list
initialPoints.forEach(addPointToList);

// Add point to the list
function addPointToList(pointName) {
    const pointElement = document.createElement('div');
    pointElement.className = 'point';
    pointElement.textContent = pointName;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removePoint(pointName);
    });

    pointElement.appendChild(removeButton);
    pointElement.addEventListener('click', () => selectPoint(pointName));

    document.getElementById('pointList').appendChild(pointElement);
    points.push(pointName);
}

// Select a point from the list
function selectPoint(pointName) {
    selectedPoint = pointName;
    document.body.style.cursor = 'crosshair';
}

// Add new point
document.getElementById('addPointButton').addEventListener('click', () => {
    const newPointName = document.getElementById('newPointName').value;
    if (newPointName && !points.includes(newPointName)) {
        addPointToList(newPointName);
        document.getElementById('newPointName').value = '';
    }
});

// Handle map click
map.on('click', (e) => {
    if (selectedPoint) {
        const marker = L.marker(e.latlng).addTo(map).bindPopup(selectedPoint);
        marker.on('click', () => marker.bindPopup(selectedPoint).openPopup());

        markers[selectedPoint] = marker;
        markersGroup.addLayer(marker);

        updatePointList();
        selectedPoint = null;
        document.body.style.cursor = 'default';
    }
});

// Remove point and its marker
function removePoint(pointName) {
    // Remove marker from map and cluster group
    if (markers[pointName]) {
        markersGroup.removeLayer(markers[pointName]);
        map.removeLayer(markers[pointName]);
        delete markers[pointName];
    }

    // Remove point from list and array
    points = points.filter(point => point !== pointName);
    updatePointList();
}

// Update point list with marker status
function updatePointList() {
    const pointList = document.getElementById('pointList');
    pointList.innerHTML = '';
    points.forEach(point => {
        const pointElement = document.createElement('div');
        pointElement.className = 'point';
        if (markers[point]) {
            pointElement.classList.add('with-marker');
        }
        pointElement.textContent = point;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removePoint(point);
        });

        pointElement.appendChild(removeButton);
        pointElement.addEventListener('click', () => selectPoint(point));
        pointList.appendChild(pointElement);
    });
}
