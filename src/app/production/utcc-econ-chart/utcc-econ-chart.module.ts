import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

import { ChartDataService } from '../services/chart-data.service';
import { UtccEconChartDisplayComponent } from '../utcc-econ-chart-display/utcc-econ-chart-display.component';
import { DcChartComponent } from '../dc-chart/dc-chart.component';
import { MaterialDcChartComponent } from '../material-dc-chart/material-dc-chart.component';
import { ChartGroupComponent } from '../chart-group/chart-group.component';

@NgModule({
  imports: [
    CommonModule,
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
    FlexLayoutModule,
  ],
  declarations: [
    UtccEconChartDisplayComponent,
    DcChartComponent,
    MaterialDcChartComponent,
    ChartGroupComponent,
  ],
  exports: [
    UtccEconChartDisplayComponent
  ],
  providers: [ChartDataService]
})
export class UtccEconChartModule { }

