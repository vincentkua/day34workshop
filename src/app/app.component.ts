import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, lastValueFrom, map } from 'rxjs';
import { Weather } from './models';

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const WEATHER_API_KEY = '68eb2eda867cd15461daa03a147a9178'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  weatherform !: FormGroup
  constructor(private fb : FormBuilder , private http: HttpClient){}

  result : Weather[] = []
  weather$!: Subscription
  // refer to day34 lecture for weatherProm$ and weatherObs$ method


  ngOnInit(): void {
    this.weatherform = this.fb.group({
      city : this.fb.control<string>("Singapore" , [Validators.required])
    })  
  }

  getWeatherObs(){
    const city = this.weatherform.value['city']

    const params = new HttpParams()
      .set('q', city)
      .set('units', 'metric')
      .set('appid', WEATHER_API_KEY)

    // TO CHECK RAW DATA ====================================
    // return this.http.get<any[]>(WEATHER_URL, { params })
    //     .pipe(map((v:any) => v))
    //     .subscribe((data) => {console.log(data);}) 

    return this.http.get<Weather[]>(WEATHER_URL, { params })
    .pipe(
      map((v:any)=> {
        const temp = v['main']['temp']        
        const weather = v['weather'] as any[]
        return weather.map(w => {
          return{
            main : w['main'],
            description : w['description'],
            temperature : temp
          } as Weather
        })
      })

    )
  }

  processform(){

    // USING SUBSCRIPTION METHOD=======================
    // if (this.weather$) {
    //   this.weather$.unsubscribe
    //   console.log("unsubscribe existing subcription...")
    // }
    // this.weather$ = this.getWeatherObs().subscribe({
    //   next:v => {
    //     this.result = v
    //   },
    //   error: err =>{
    //     console.error("error : " + err)
    //   },
    //   complete: () => {
    //     console.warn("completed...")        
    //   }
    // })


    // USING PROMISE METHOD=============================
    lastValueFrom(
      this.getWeatherObs()
    ).then(v => {
      console.info('resolved: ', v)
      this.result = v
    }).catch(err => {
      console.error('>>> error: ', err)
    })


  }

}
