import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule, MatToolbar } from '@angular/material/toolbar';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatSelectModule} from '@angular/material/select';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { ChartDataService } from '../services/chart-data.service';
import { UtccEconChartDisplayComponent } from '../utcc-econ-chart-display/utcc-econ-chart-display.component';
import { DcChartComponent } from '../dc-chart/dc-chart.component';
import { MaterialDcChartComponent } from '../material-dc-chart/material-dc-chart.component';
import { MaterialDcNumberGroupComponent } from '../material-dc-number-group/material-dc-number-group.component';
import { NumberGroupChartComponent } from '../number-group-chart/number-group-chart.component';

import { MuuriGridGroupComponent } from '../chart-groups/muuri-grid-group/muuri-grid-group.component';
import { ChartGroupGdpComponent } from '../chart-groups/chart-group-gdp/chart-group-gdp.component';
import { ChartGroupImportsComponent } from '../chart-groups/chart-group-imports/chart-group-imports.component';
import { ChartGroupExportsComponent } from '../chart-groups/chart-group-exports/chart-group-exports.component';
import { ChartGroupImportPotentialComponent } from '../chart-groups/chart-group-import-potential/chart-group-import-potential.component';
import { ChartGroupExportPotentialComponent } from '../chart-groups/chart-group-export-potential/chart-group-export-potential.component';
import { ChartGroupForeignExchangeComponent } from '../chart-groups/chart-group-foreign-exchange/chart-group-foreign-exchange.component';
import { ChartInfoDialogComponent } from '../chart-info-dialog/chart-info-dialog.component';

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
    MatDialogModule,
    MatExpansionModule,
    ScrollDispatchModule
  ],
  declarations: [
    UtccEconChartDisplayComponent,
    DcChartComponent,
    MaterialDcChartComponent,
    MaterialDcNumberGroupComponent,
    NumberGroupChartComponent,
    MuuriGridGroupComponent,
    ChartGroupGdpComponent,
    ChartGroupImportsComponent,
    ChartGroupExportsComponent,
    ChartGroupImportPotentialComponent,
    ChartGroupExportPotentialComponent,
    ChartGroupForeignExchangeComponent,
    ChartInfoDialogComponent
  ],
  entryComponents: [
    ChartInfoDialogComponent
  ],
  exports: [
    UtccEconChartDisplayComponent,
    ChartGroupGdpComponent,
    ChartGroupExportPotentialComponent,
    ChartGroupExportsComponent,
    ChartGroupForeignExchangeComponent,
    ChartGroupImportPotentialComponent,
    ChartGroupImportsComponent,
    MatToolbar
  ],
  providers: [ChartDataService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class UtccEconChartModule { }

