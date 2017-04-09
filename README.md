# MMM-max
Additional Module for MagicMirror²  https://github.com/MichMich/MagicMirror/

# Module: MMM max
This module displays your local MAX! heating temperatures from your MAX! cube.

## Installation

1. Navigate into your MagicMirror's modules folder and execute git clone https://github.com/mirko3000/MMM-max.git. A new folder will appear navigate into it.
2. Execute npm install to install the node dependencies.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
		module: 'MMM-max',
		position: 'bottom_left',
		header: 'Heizung / Temperatur',  // This is optional
		config: {
			// See 'Configuration options' for more information.
		}
	},
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>maxIP</code></td>
			<td>The IP address of your local MAX! cube.<br>
				<br><b>Possible values:</b> <code>192.168.1.100</code>
				<br><b>Default value:</b> <code>none</code>
			</td>
		</tr>
		<tr>
			<td><code>updateInterval</code></td>
			<td>The update interval in minutes.<br>
				<br><b>Possible values:</b> <code>5</code>
				<br><b>Default value:</b> <code>5</code>
			</td>
		</tr>
		<tr>
			<td><code>twoColLayout</code></td>
			<td>Defines the layout either in a single or 2-column layout. In false the single column layout is used.<br>
				<br><b>Possible values:</b> <code>true</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
	</tbody>
</table>


## Base API

This Modul is using the maxcube library (https://github.com/ivesdebruycker/maxcube).
