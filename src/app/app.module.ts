import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UtccEconChartModule } from './production/utcc-econ-chart/utcc-econ-chart.module';
@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    BrowserModule,
    UtccEconChartModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
