/**
 * Created by sebas_000 on 19/09/2016.
 */
import {PhotoBooth} from "./photo-booth";
import {TeachSelfie} from "./teach-selfie";
import {NgModule} from "@angular/core";

@NgModule({
    declarations: [TeachSelfie, PhotoBooth],
    exports: [TeachSelfie, PhotoBooth]
})
export class PhotoBoothModule { }