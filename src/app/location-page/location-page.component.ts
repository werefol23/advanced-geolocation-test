import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationService } from '../service/geolocation.service';
declare var AdvancedGeolocation:any;

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss'],
})
export class LocationPageComponent implements OnInit {

  public latitud;
  public longitud;
  public latitud2;
  public longitud2;
  public cargando;

  constructor(private platform: Platform,
              private loadingController: LoadingController,
              private locationService: Geolocation,
              private geolocService: GeolocationService) { }

  ngOnInit() {
    this.prepararCargando('Esperando geolocalización...').then(() => {
      this.cargando.present();
      this.location();
      this.geolocation3();
    });
  }

  location() {
    this.locationService.getCurrentPosition().then( ( resp ) => {
        this.latitud2 = resp.coords.latitude.toString();
        this.longitud2 = resp.coords.longitude.toString();
        console.log( this.latitud2 + ',' + this.longitud2 );
        this.cargando.dismiss();
    } ).catch( ( error ) => {
        console.log( 'Error getting location', error );
    } );
  }

  geolocation() {
    if (this.platform.is('android')) {
      this.platform.ready().then(() => {
        AdvancedGeolocation.start((success) => {
          try {
            var jsonObject = JSON.parse(success);
            console.log("Provider " + JSON.stringify(jsonObject));
            switch (jsonObject.provider) {
              case "gps":
                console.log("setting gps ====<<>>" + jsonObject.latitude);

                this.latitud = jsonObject.latitude.toString();
                this.longitud = jsonObject.longitude.toString();
                console.log('Latitud: '+ this.latitud + ' Longitud: ' + this.longitud);
                this.cargando.dismiss();
                break;
            }
          }
          catch (exc) {
            console.log("Invalid JSON: " + exc);
          }
        },
          function (error) {
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

      });
    }
  }

  geolocation2() {
    
    AdvancedGeolocation.start((success) => {
      try {
        var jsonObject = JSON.parse(success);
        console.log("Provider " + JSON.stringify(jsonObject));
        switch (jsonObject.provider) {
          case "gps":
            console.log("setting gps ====<<>>" + jsonObject.latitude);

            this.latitud = jsonObject.latitude;
            this.longitud = jsonObject.longitude;
            console.log('Latitud: '+ this.latitud + ' Longitud: ' + this.longitud);
            this.cargando.dismiss();
            break;
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

  geolocation3() {
    this.geolocService.getLocation();
    
    this.geolocService.location$.subscribe( location => {
      if (location) {
        this.latitud = location.latitude.toString();
        this.longitud = location.longitude.toString();
        console.log('Latitud: '+ this.latitud + ' Longitud: ' + this.longitud);
        this.cargando.dismiss(); 
      }
    });
  }

  async prepararCargando( mensaje: string ) {
    this.cargando = await this.loadingController.create( {
        message: mensaje
    } );
}

}
