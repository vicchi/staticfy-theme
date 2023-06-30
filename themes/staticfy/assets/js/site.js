var vicchi = vicchi || {};

vicchi.site = (function () {
    const is_dark_mode = function () {
        return localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    const toggle_dark_mode = function () {
        if (is_dark_mode()) {
            localStorage.theme = 'light';
            document.documentElement.classList.remove('dark');
        }
        else {
            localStorage.theme = 'dark';
            document.documentElement.classList.add('dark');
        }
    };

    const paginator = function (event) {
        const page = parseInt(event.target.value);
        if (page === 0) {
            window.location.href = '/';
        }
        else {
            window.location.href = `/page/${event.target.value}/`;
        }
    };

    const post_map = function (wrapper) {
        const lng = wrapper.dataset.geoLng;
        const lat = wrapper.dataset.geoLat;
        const place = wrapper.dataset.geoPlace;

        var point = L.latLng([lat, lng]);
        var map = L.map('map', {
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
            iconUrl: 'https://status.vicchi.org/static/heroicons/24/solid/map-pin.svg',
            iconSize: [24, 24],
            className: 'push-pin'
        });
        var marker = L.marker(point, {icon: icon}).addTo(map);
    };

    return {
        is_dark_mode: is_dark_mode,
        toggle_dark_mode: toggle_dark_mode,
        paginator: paginator,
        post_map: post_map
    };
})();

window.addEventListener('load', function (event) {
    if (vicchi.site.is_dark_mode()) {
        document.documentElement.classList.add('dark');
    }
    else {
        document.documentElement.classList.remove('dark');
    }

    document.getElementById("toggle-dark-mode").addEventListener("click", vicchi.site.toggle_dark_mode);

    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.addEventListener('change', vicchi.site.paginator);
    }

    const postmap = document.getElementById('map-wrapper');
    if (postmap) {
        vicchi.site.post_map(postmap);
    }
});
