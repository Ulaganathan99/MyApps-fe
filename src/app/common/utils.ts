import { Injectable } from "@angular/core";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
  } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})

export class Utils{
     horizontalPosition: MatSnackBarHorizontalPosition = 'end';
     verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        private _snackBar: MatSnackBar,
    ){}

     openErrorSnackBar(content:string){
        this._snackBar.open(content, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration : 1500,
            panelClass: ['error-snackbar']
          });
    }
    openSuccessSnackBar(content: string){
        this._snackBar.open(content, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration : 2000,
            panelClass: ['success-snackbar']
          });
    }


}