import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

declare var loadImage: any;

@Injectable()
export class UploadService {

  constructor () {

  }

  public dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], {type: mimeString});
  }

  public makeBlobRequest (url: string, name: string, email: string, topic: string, blob: Blob, filename: string): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData();
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      console.log('appending file: ', filename, blob);

      //Generate thumbnail & append
      var options = {
        canvas: true,
        maxWidth: 300,

      };

      var onThumbNailLoaded = canvas => {

        var dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        var thumbBlob = this.dataURItoBlob(dataUrl);

        formData.append("person_selfie", blob, filename);
        formData.append("thumb_person_selfie", thumbBlob, "thumb_"+filename);
        formData.append("person_name", name);
        formData.append("person_email", email);
        formData.append("person_topic", topic);

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log('response', xhr.response);
              observer.next(JSON.parse(xhr.response));
              observer.complete();
            } else {
              observer.error(xhr.response);
            }
          }
        };

        xhr.open('POST', url, true);
        xhr.send(formData);
      };

      loadImage(blob, onThumbNailLoaded, options);

    });
  }
}
