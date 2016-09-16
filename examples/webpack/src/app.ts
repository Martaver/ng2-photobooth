import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js';
import {Component} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {PhotoBooth} from 'ng2-photobooth/components';
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

const platform = platformBrowserDynamic();

@Component({
    selector: 'app',
    template: `<div>                   
                   <photo-booth></photo-booth>
               </div>`
})
export class App {

    message = "";

    onKeyUp(input) {
        this.message = input.value;
    }

}

@NgModule({
    imports: [BrowserModule],
    declarations: [App, PhotoBooth],
    bootstrap: [App]
})
export class AppModule { }

platform.bootstrapModule(AppModule);