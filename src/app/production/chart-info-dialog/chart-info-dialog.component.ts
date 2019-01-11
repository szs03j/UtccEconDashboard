import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ChartInfoDialogData } from './chart-info-dialog-data';


@Component({
  selector: 'app-chart-info-dialog',
  templateUrl: './chart-info-dialog.component.html',
  styleUrls: ['./chart-info-dialog.component.css']
})
export class ChartInfoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChartInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChartInfoDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
