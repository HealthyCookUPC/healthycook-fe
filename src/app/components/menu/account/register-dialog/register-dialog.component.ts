import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})
export class RegisterDialogComponent implements OnInit {


  ngOnInit(): void {
  }
  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
