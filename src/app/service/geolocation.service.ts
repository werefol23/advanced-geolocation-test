import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var AdvancedGeolocation:any;

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  public location$ = new BehaviorSubject(null);

  constructor() { }

  getLocation() {
    AdvancedGeolocation.start((success) => {
      try {
        var jsonObject = JSON.parse(success);
        console.log("Provider " + JSON.stringify(jsonObject));
        if (jsonObject) {
          switch (jsonObject.provider) {
            case "gps":
              console.log("setting gps ====<<>>" + jsonObject.latitude);
              this.location$.next(jsonObject);
              break;
          }
        }
      } catch (exc) {
        console.log("Invalid JSON: " + exc);
      }
    }, function (error) {
        console.log("ERROR! " + JSON.stringify(error));
    },
    {
      "minTime": 1500,         // Min time interval between updates (ms)
      "minDistance": 5,       // Min distance between updates (meters)
      "noWarn": true,         // Native location provider warnings
      "providers": "gps",     // Return GPS, NETWORK and CELL locations
      "useCache": false,       // Return GPS and NETWORK cached locations
      "satelliteData": false, // Return of GPS satellite info
      "buffer": false,        // Buffer location data
      "bufferSize": 0,         // Max elements in buffer
      "signalStrength": false // Return cell signal strength data
    });
  }
}
