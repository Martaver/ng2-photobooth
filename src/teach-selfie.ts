/**
 * Created by sebas_000 on 9/08/2016.
 */
import {Component, EventEmitter, Output, ViewChild, NgZone, ElementRef} from '@angular/core';
import {PhotoBooth, GotSnapshotEvent} from "./photo-booth";
import {UploadService} from "./UploadService";

declare var loadImage: any;

@Component({
  selector: 'teach-selfie',
  styles: [ `

#teach-bg {
  background:

    linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.3)
    );
  background-size: cover;
  min-height: 100%;
}

#teach-container {
  position: relative;
  left: 0;
  right: 0;
  margin: auto;

  display: flex;
  flex-direction: column;

  height:100%;
  min-height: 100%;
  max-width: 768px;
}

teach-details {
  display: flex !important;
  flex-direction: column;
  flex: 1;
}

.teach-details-container {

  /*display: flex;*/
  flex-direction: column;

}

#details-form {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.details-form-group {
  display: flex;
  flex-direction: column;
  background: rgba(198, 198, 198, 0.32) !important;
  margin: 0px 4px 4px 4px;
  padding: 12px 12px 36px 12px;
}

:host >>> input.md-input-element {
  color: rgba(198, 198, 198, 1) !important;
}

:host >>> label.md-input-placeholder {
  color: rgba(198, 198, 198, 1) !important;
}

:host >>> md-input {
  overflow: inherit;
  margin-bottom: 12px;
}

:host >>> md-hint {
  color: darkorange;
}

.inline-instructions {
  color: rgba(198, 198, 198, 1) !important;
  font-family: 'Open Sans', sans-serif;
}

.teach-container-content {
  z-index: 1;
  color: white;
}

.teach-container-actions {
  flex: 1;
  height: 25%;
  display: flex;
  flex-direction: row;
  z-index: 1;
}

.teach-container-instructions {

  background: rgba(198, 198, 198, 0.32) !important;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 4px;
  padding: 4px;

  color: rgba(198, 198, 198, 1) !important;
  font-family: 'Open Sans', monospace;
  font-size: 1.3em;

  text-align: center;
}

.teach-container-actions button {
  background: rgba(198, 198, 198, 0.32) !important;
  width: 100%;
  margin-bottom: 4px;
  margin-left: 4px;
  padding: 12px;

  min-height: 60px;
}

.teach-container-actions i.material-icons {
  color: rgba(198, 198, 198, 1) !important;
  font-size: 2em;
  position: relative;
  top: 5px;
}

.teach-container-actions button:last-child {
  margin-right: 4px;
}

.teach-container-actions button .prefix {
  font-family: 'Averia Serif Libre', cursive;
  font-size: 1.3em;
  color: rgba(198, 198, 198, 1);
}

.teach-container-actions button .action {
  font-family: 'Averia Serif Libre', cursive;
  font-size: 2.3em;
  color: rgba(198, 198, 198, 1);
  text-transform: uppercase;
}

.photo-booth-container {

  padding: 0px 4px;
}

.teach-container-form {
  flex-grow: 1;
  z-index: 1;
  color: white;
}

.after-selfie-container {
  margin: 24px 0 24px 0;
  flex: 1;

  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row; /* works with row or column */
  flex-direction: row;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}

.snapshot-size {
  width: 50%;
}

.snapshot {
   width: 100%;
   height: 100%;
}

#photo-booth-ios {
  padding: 12px;
}

#photo-booth-ios .take-picture {
  width: 100%;
}

#photo-booth-ios img {
  object-fit: cover;
}

#photo-booth-ios .icon-bg {

  background: rgba(198, 198, 198, 0.32) !important;
}

#photo-booth-ios input {
  display: none;
}


` ],
  template: `

    <div class="teach-container-content">
                
      <div class="teach-container-instructions">
        Give us a crazy smile!
      </div>
      
      <div *ngIf="!iOS" class="center" style="padding: 12px;">
        <div class="constrain-ratio-1-1" style="width: 70%;"> 
            <div class="constrain-ratio-content">
                <div class="circle" style="height: 100%; width: 100%; position: relative; overflow: hidden;">
                  <photo-booth (gotSnapshot)="onGotSnapshot($event)"></photo-booth>
                </div>        
            </div>
          </div>
      </div>
      
      <div *ngIf="iOS" id="photo-booth-ios" class="center">                                             
        
        <div class="take-picture constrain-ratio-1-1" style="width: 70%">
          
          <label *ngIf="!(dataUrl)" class="constrain-ratio-content"> <!--Technique for styling file upload inputs: http://stackoverflow.com/questions/21842274/cross-browser-custom-styling-for-file-upload-button-->
            <input type="file" accept="image/*" capture="camera" (change)="onInputChanged($event)">
            <div class="icon-bg center circle">
              <i class="material-icons">photo_camera</i>
            </div>            
          </label>  
          
          <div *ngIf="dataUrl" class="constrain-ratio-content">
            <img [src]="dataUrl" class="circle">
          </div>          
          
        </div>        
      </div>
      
      <canvas id="photo-booth-ios-canvas" style="display: none"></canvas>
      
    </div>   
    
    <div class="teach-container-actions" >
    
      <button md-button (click)="backToSnapshot($event)" *ngIf="!hasSnapshot && !iOS"> 
        <i class="material-icons">photo_camera</i>
      </button>
    
      <button md-button (click)="nup($event)" *ngIf="hasSnapshot">
        <i class="material-icons">thumb_down</i>
      </button>
        
      <button md-button (click)="yup($event)" *ngIf="hasSnapshot">
        <i class="material-icons">thumb_up</i>
      </button>
          
    </div>
`
})
export class TeachSelfie{

  private window :any;
  private navigator :any;
  private iOS: any;

  @Output() gotSelfie = new EventEmitter();

  @ViewChild(PhotoBooth) photoBooth:PhotoBooth;

  private hasSnapshot: boolean;
  private snapshot: GotSnapshotEvent;
  private dataUrl: string;
  private orientation: any;

  constructor(private zone: NgZone, private uploadService: UploadService) {

  }


  ngOnInit() {

    this.window = window;
    this.navigator = window.navigator;
    this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !this.window.MSStream;
  }

  private onGotSnapshot(event:GotSnapshotEvent) {

    this.snapshot = event;
    this.hasSnapshot = true;
  }



  private onInputChanged(event) {

    event.preventDefault();

    loadImage.parseMetaData(event.target.files[0], data => { this.zone.run(() => {

        this.orientation = data.exif ? data.exif.get('Orientation') : 1;

        var options = {
          orientation: this.orientation,
          canvas: true
        };

        var handleLoad = canvas => { this.zone.run(() => {

          this.dataUrl = canvas.toDataURL('image/jpeg');
          this.snapshot = new GotSnapshotEvent(this.uploadService.dataURItoBlob(this.dataUrl), this.dataUrl);
          this.hasSnapshot = true;
        })};

        loadImage(event.target.files[0], handleLoad, options);
      });
    });

  }

  private backToSnapshot(event) {

    event.preventDefault();

    this.photoBooth.snapshot()
  }

  private nup(event){

    event.preventDefault();

    if(!this.iOS) this.photoBooth.start();
    this.dataUrl = null;
    this.snapshot = null;
    this.hasSnapshot = false;
  }

  private yup(event){

    event.preventDefault();
    this.gotSelfie.emit(this.snapshot);
  }

}
