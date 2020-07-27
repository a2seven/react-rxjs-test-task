import React from 'react';
import { Observable, merge, combineLatest } from 'rxjs';
import { timeout, catchError, throttleTime } from 'rxjs/operators';
import EventEmitter from './EventEmitter';
import { randomFloat, randomInt } from "./utils";

const em = new EventEmitter();

const generateObserverMonitoring = (type) => {
  const obs = new Observable((obs) => {
    em.on(type, (data) => {
      obs.next(data);
    })
  })

  const tobs = obs
    .pipe(
      timeout(1000),
      catchError((err, caught) => merge([null], tobs)),
    )

  return tobs;
}

const generateRandomData = (arrayIds) => {
  const generateRandomValue = (type, settings) => {
    const rTimer = randomInt(100, 2000);
    const rValue = randomFloat(settings.a, settings.b);
    const id = setTimeout(() => {
      em.emit(type, rValue);
      generateRandomValue(type, settings);
    }, rTimer);

    arrayIds.push(id);
  }

  generateRandomValue('temperature', { a: 0, b: 45 });
  generateRandomValue('pressure', { a: 1, b: 2 });
  generateRandomValue('humidity', { a: 0, b: 3 });
}

export default (Component) => {
  class WithMonitoringData extends React.Component {
    timeoutIds = [];
    state = {
      temp: null,
      pressure: null,
      humidity: null,
    }

    componentDidMount() {
      generateRandomData(this.timeoutIds);

      const temp = generateObserverMonitoring('temperature');
      const air = generateObserverMonitoring('pressure');
      const humidity = generateObserverMonitoring('humidity');

      this.monitoring = combineLatest([temp, air, humidity])
        .pipe(throttleTime(100))
        .subscribe((value) => {
          this.setState({
            temp: value[0],
            pressure: value[1],
            humidity: value[2],
          })
        });
    }

    componentWillUnmount() {
      this.monitoring.unsubscribe();
      this.timeoutIds.forEach(clearTimeout);
    }

    render() {
      return (
        <Component {...this.state}/>
      );
    }
  }

  return WithMonitoringData;
}
