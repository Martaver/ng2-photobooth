import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js';
import {Component} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {TeachSelfie, PhotoBooth, UploadService} from "ng2-photobooth";

const platform = platformBrowserDynamic();

@Component({
    selector: 'app',
    template: `<div>                   
                   <teach-selfie></teach-selfie>  
               </div>`
})
export class App {

}

@NgModule({
    imports: [BrowserModule],
    declarations: [App, TeachSelfie, PhotoBooth],
    providers: [UploadService],
    bootstrap: [App]
})
export class AppModule { }

platform.bootstrapModule(AppModule);