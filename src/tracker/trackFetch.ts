import _ from '../leaflet-define';


export interface TrackPoint {
  //{"time_":1470536528000,"lat":56.09977666666667,"long":47.30272,"speed":4.550659,"note":""}
  time_: number,
  lat: number,
  long: number,
  speed: number,
  note: string
}

interface UserServerResponse {
  name: string;
  code: number;
  result: TrackPoint[];
  text: string;
}

const colors: string[] = ['red', 'blue', 'green'];
function createPolyline(index: number, latlngs: number[][] = []) {
  return _().polyline(latlngs,  {weight: 5, color: colors[index % colors.length], opacity: 0.3});
}

export class TrackFetch {
    // monitor: TrackMonitorModel = new TrackMonitorModel();
    private timerId: number = 0;
    private lastPointTime: number = 0;
    private polylinesGroup = _().layerGroup();
    private polylinesMap: {[key: string]: any} = {};
    private markersMap: {[key: string]: any} = {};

    getPolylines() {
      return this.polylinesGroup;
    }
  
    startMonitoring() {
      this.timerId = window.setInterval(this.monitoring, 10000);
    }
  
    monitoring = async () => {
      let trackDataParam = '';
      const pathname = document.location && document.location.origin || '';
      trackDataParam = pathname + `/baikal19tracks/${this.lastPointTime}`;
      let myHeaders = new Headers();
      const result: Response = await fetch(trackDataParam,
        {
          method: 'GET',
          headers: myHeaders,
          mode: 'no-cors',
          cache: 'reload'
        });
      if (result.ok == false)
        return;
      const resultArray: UserServerResponse[] = await result.json(); // 
      const times: number[] = resultArray.map(user => {
        return user.result.length ? user.result[user.result.length - 1].time_ : 0;
      });
      const maxtime = Math.max(...times);
      this.lastPointTime = Math.max(this.lastPointTime, maxtime);

      resultArray.forEach((userdata: UserServerResponse, i: number) => {
        const latlngs = userdata.result.map(v => [v.lat, v.long]);
        if (this.polylinesMap[userdata.name] == undefined) {
          // polyline
          this.polylinesMap[userdata.name] = createPolyline(i, latlngs);
          this.polylinesGroup.addLayer(this.polylinesMap[userdata.name]);
        } else
          latlngs.forEach((e: number[]) => this.polylinesMap[userdata.name].addLatLng(e));
        // marker
        if (latlngs.length < 1)
          return;
        const lastPos = latlngs[latlngs.length -1];
        if (this.markersMap[userdata.name])
          this.markersMap[userdata.name].setLatLng(lastPos);
        else {
          this.markersMap[userdata.name] = _().marker(lastPos, {title: userdata.name});
          this.polylinesGroup.addLayer(this.markersMap[userdata.name]);
        }
      });
    }

    stopMonitoring() {
      window.clearInterval(this.timerId);
    }
  }
  