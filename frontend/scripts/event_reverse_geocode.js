ymaps.ready(init);

function init() {
  var myPlacemark,
    myMap = new ymaps.Map(
      'map',
      {
        center: [55.753994, 37.622093],
        zoom: 13,
      },
      {
        searchControlProvider: 'yandex#search',
      },
    );

  myMap.events.add('click', function (e) {
    var coords = e.get('coords');

    if (myPlacemark) {
      myPlacemark.geometry.setCoordinates(coords);
    } else {
      myPlacemark = createPlacemark(coords);
      myMap.geoObjects.add(myPlacemark);
      myPlacemark.events.add('dragend', function () {
        getAddress(myPlacemark.geometry.getCoordinates());
      });
    }
    getAddress(coords);
    sendCoordinatesToServer(coords);
  });

  function createPlacemark(coords) {
    return new ymaps.Placemark(
      coords,
      {
        iconCaption: 'поиск...',
      },
      {
        preset: 'islands#violetDotIconWithCaption',
        draggable: true,
      },
    );
  }

  function getAddress(coords) {
    myPlacemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);

      myPlacemark.properties.set({
        iconCaption: [
          firstGeoObject.getLocalities().length
            ? firstGeoObject.getLocalities()
            : firstGeoObject.getAdministrativeAreas(),
          firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
        ]
          .filter(Boolean)
          .join(', '),
        balloonContent: firstGeoObject.getAddressLine(),
      });
    });
  }

  function handleCarsResponse(cars) {
    console.log('Машины успешно получены:', cars);

  }

  function sendCoordinatesToServer(coords) {
    fetch('http://localhost:3000/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coords }),
    })
      .then((response) => response.json())
      .then(handleCarsResponse)
      .catch((error) =>
        console.error('Ошибка при отправке координат на сервер:', error),      );
  }
}
