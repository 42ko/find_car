import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CarsService {
  async findNearbyCars(coords): Promise<any[]> {
    let lat = coords[0]
    let lng = coords[1]
    let radius = 1
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
      `https://geocode-maps.yandex.ru/1.x/?geocode=${lng},${lat}&format=json&apikey=4c41980a-edc1-451e-a097-488e850a7d09`
    );

    const features = response.data.response.GeoObjectCollection.featureMember;

    const roads = features.filter((feature) => feature.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'street');


    return roads.length > 0;
  }
}
