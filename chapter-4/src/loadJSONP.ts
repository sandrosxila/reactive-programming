import {Observable, Observer} from 'rxjs';
import {Response} from './data.d';

export function loadJSONP(settings: {
    url: string;
    callbackName: "eqfeed_callback";
  }): Observable<{
    status: number;
    responseType: string;
    response: Response;
    originalEvent: Event;
  }> {
    const { url, callbackName } = settings;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    window[callbackName] = (data: Response) => {
      window[callbackName].data = data;
    };
  
    return Observable.create(
      (
        observer: Observer<{
          status: number;
          responseType: string;
          response: Response;
          originalEvent: Event;
        }>
      ) => {
        const handler = (e: Event) => {
          const status = e.type === "error" ? 400 : 200;
          const response = window[callbackName].data;
  
          if (status === 200) {
            observer.next({
              status,
              responseType: "jsonp",
              response,
              originalEvent: e,
            });
          } else {
            observer.error({
              type: "error",
              status,
              originalEvent: e,
            });
          }
        };
  
        script.onload = handler;
        script.onerror = (e) => typeof e !== "string" && handler(e);
  
        const head = document.head;
        head.insertBefore(script, head.firstChild);
      }
    );
  }