import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { DcChartComponent } from './dc-chart/dc-chart.component';
import { ChartDataService } from './services/chart-data.service';
import { MaterialDcChartComponent } from './material-dc-chart/material-dc-chart.component';
import { UtccEconChartDisplayComponent } from './utcc-econ-chart-display/utcc-econ-chart-display.component';
import { ChartGroupComponent } from './chart-group/chart-group.component';

@NgModule({
  declarations: [
    AppComponent,
    DcChartComponent,
    MaterialDcChartComponent,
    UtccEconChartDisplayComponent,
    ChartGroupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    LayoutModule,
    MatListModule,
    MatSelectModule,
    FlexLayoutModule
  ],
  providers: [ChartDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
