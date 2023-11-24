  import { Injectable } from '@nestjs/common';
  import axios from 'axios';

  @Injectable()
  export class CarsService {
    async findNearbyCars(coords, radius): Promise<any> {
      const lat = coords[0]
      const lng = coords[1]
      const nearbyCars = [];

      for (let i = 0; i < 5; i++) {
        const randomDistance = Math.random() * radius;
        const randomAngle = Math.random() * 2 * Math.PI;

        const newLat = lat + (randomDistance / 111.32) * Math.cos(randomAngle);
        const newLng = lng + (randomDistance / (111.32 * Math.cos(lat))) * Math.sin(randomAngle);

        const isOnRoad = await this.isOnRoad(newLat, newLng);

        if (isOnRoad) {
          nearbyCars.push({ lat: newLat, lng: newLng });
        } else {
          i--;
        }
      }

      return nearbyCars;
    }

    private async isOnRoad(lat: number, lng: number): Promise<boolean> {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?geocode=${lng},${lat}&format=json&apikey=7c3069b2-fd18-4f67-b5c1-dfc736829678`
      );

      const features = response.data.response.GeoObjectCollection.featureMember;

      const roads = features.filter((feature) => feature.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'street');


      return roads.length > 0;
    }
  }
