import React from 'react';
import './App.css';
import withMonitoringData from './withMonitoringData';

const App = ({
  temp,
  pressure,
  humidity,
}) => {
  return (
    <div className="App">
     <table>
       <thead>
        <tr>
          <th>Temperature</th>
          <th>Air pressure</th>
          <th>Humidity</th>
        </tr>
       </thead>
       <tbody>
          <tr>
            <td>{temp || 'N/A'}</td>
            <td>{pressure || 'N/A'}</td>
            <td>{humidity || 'N/A'}</td>
          </tr>
       </tbody>
     </table>
    </div>
  );
}

export default withMonitoringData(App);
