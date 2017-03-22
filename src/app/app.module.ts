import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

// My modules
import { Ng2BootstrapModule } from 'ng2-bootstrap';

//kendocrudimport 
import { GridModule } from '@progress/kendo-angular-grid';

//services
import { EditService } from '../shared/edit.service';

import { Jsonp, JsonpModule } from '@angular/http';

//Firebase
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = {
  apiKey: "AIzaSyCLxqdp9F9T5vyPalgsCHZ0qlxncniE0fQ",
  authDomain: "kendocrud.firebaseapp.com",
  databaseURL: "https://kendocrud.firebaseio.com",
  storageBucket: "kendocrud.appspot.com",
  messagingSenderId: "747135722284"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    GridModule,
    JsonpModule
  ],
  providers: [EditService],
  bootstrap: [AppComponent]
})
export class AppModule { }
