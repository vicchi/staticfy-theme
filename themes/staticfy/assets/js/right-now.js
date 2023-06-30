import { STATUS_API_URL } from "./config.js";

var vicchi = vicchi || {};

vicchi.now = (function () {
    var rightnow = async function () {
        var div = document.getElementById('dynamic-status');
        if (div !== null) {
            var resp = await fetch(`${STATUS_API_URL}/static/statuslog.json`);
            const status = await resp.json();

            resp = await fetch(`${STATUS_API_URL}/v1/checkin`);
            const data = await resp.json();
            const weather = data['weather'];
            const checkin = data['checkin'];

            var place;
            if (checkin['location']['city']) {
                place = `In ${checkin['location']['city']}`;
            }
            else if (checkin['location']['state']) {
                place = `In ${checkin['location']['city']}`;
            }
            else {
                place = 'At home'
            }
            var statuses = [];
            var elem = document.createElement('p');
            elem.setAttribute('class', 'mb-0');
            elem.innerHTML = status['bio'];
            statuses.push(elem)

            elem = document.createElement('p');
            elem.setAttribute('class', 'mb-0');
            elem.innerHTML = `<img class="inline mt-0 mb-0 w-6 h-6" src="${weather['icon']}" ></img> ${place} it's currently ${weather['temp']}&deg;C and ${weather['descr']}`;
            statuses.push(elem)

            status['status'].forEach((status) => {
                var elem = document.createElement('p');
                elem.setAttribute('class', 'mb-0');
                elem.innerHTML = `${status['emoji']}&nbsp;${status['content']}`;
                statuses.push(elem);
            });
            div.replaceChildren(...statuses);

            var mapdiv = document.getElementById('checkin-map');
            if (mapdiv !== null) {
                document.getElementById('checkin-setup').classList.add('hidden');
                document.getElementById('checkin-wrapper').classList.remove('hidden');

                const lng = checkin['location']['lng'];
                const lat = checkin['location']['lat'];
                const place = checkin['name'];
                const timestamp = checkin['timestamp'];
                const icon_url = checkin['icon'];

                var point = L.latLng([lat, lng]);
                var map = L.map('checkin-map', {
                    zoomControl: false,
                    doubleClickZoom: false,
                    dragging: false,
                    scrollWheelZoom: false
                }).setView(point, 13);
                var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 20
                }).addTo(map);
                var scale = L.control.scale().addTo(map);
                var icon = L.icon({
                    iconUrl: icon_url,
                    iconSize: [24, 24],
                    className: 'push-pin'
                });
                var marker = L.marker(point, { icon: icon }).addTo(map);

                var span = document.getElementById('checkin-place');
                span.innerHTML = `${place}`;
                span = document.getElementById('checkin-date');
                span.innerHTML = `${timestamp}`;
            }
        }

    };

    var musicnow = async function () {
        var div = document.getElementById('now-music');
        if (div !== null) {
            var resp = await fetch(`${STATUS_API_URL}/v1/listening`);
            const music = await resp.json();

            music['tracks'].forEach(function (track, i) {
                document.getElementById(`track-${i}-url`).href = track['url'];
                document.getElementById(`track-${i}-url`).setAttribute('title', track['track']);
                document.getElementById(`track-${i}-name`).innerHTML = track['track'];
                document.getElementById(`track-${i}-artist`).innerHTML = track['artist'];
                document.getElementById(`track-${i}-image`).src = track['image'];
                document.getElementById(`track-${i}-image`).alt = track['track'];
            });

            music['artists'].forEach(function (artist, i) {
                document.getElementById(`artist-${i}-url`).href = artist['url'];
                document.getElementById(`artist-${i}-url`).setAttribute('title', artist['name']);
                document.getElementById(`artist-${i}-name`).innerHTML = artist['name'];
                document.getElementById(`artist-${i}-count`).innerHTML = `${artist['count']} times`;
                document.getElementById(`artist-${i}-image`).src = artist['image'];
                document.getElementById(`artist-${i}-image`).alt = artist['name'];
            });

            music['releases'].forEach(function (release, i) {
                document.getElementById(`release-${i}-url`).href = release['url'];
                document.getElementById(`release-${i}-url`).setAttribute('title', release['name']);
                document.getElementById(`release-${i}-name`).innerHTML = release['release'];
                document.getElementById(`release-${i}-artist`).innerHTML = release['artist'];
                document.getElementById(`release-${i}-image`).src = release['image'];
                document.getElementById(`release-${i}-image`).alt = release['release'];
            });

            document.getElementById('music-setup').classList.add('hidden');
            document.getElementById('music-wrapper').classList.remove('hidden');
        }
    };

    return {
        rightnow: rightnow,
        musicnow: musicnow
    };
})();

window.addEventListener('load', function (event) {
    vicchi.now.rightnow();
    vicchi.now.musicnow();
});
