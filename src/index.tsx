import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LeafletMap } from './leafletMap';
import { FeaturesList, RegisterOnList } from './features/features-list';
// import { MovementMarkersList } from './features/movement-markers';
import { MilestonesList } from './features/mile-stones';
import { ShowPlacesList } from './features/show-places';
import { ShowGasStationList } from './features/gas-stations';


// movement markers register
// RegisterOnList(new MovementMarkersList('mml'));
RegisterOnList(new ShowPlacesList('Достопримечательности'));
RegisterOnList(new MilestonesList('Вехи'));
RegisterOnList(new ShowGasStationList('Заправки'));

// map
ReactDOM.render(<LeafletMap featuresList={FeaturesList.featuresList}/>, document.getElementById('map'));
