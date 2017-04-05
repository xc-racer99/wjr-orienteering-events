/* List of colors to appear for the different event categories - International, National, Regional, Local, Club */
var eventTypeColors = ["blue", "red", "orange", "yellow", "green"];

function filterByClub(event) {
	return clubIds.indexOf(event.club.id) != -1;
}

function convertTimestamps(events, timezone) {
	// If the first (presumably only) clubId is 0, we want all events
	if (clubIds[0] == 0) {
		var wantedEvents = events;
	} else {
		var wantedEvents = events.filter(filterByClub);
	}

	if (timezone == 'local') {
		for (var i = 0; i < wantedEvents.length; i++) {
			// Convert from UNIX timestamps to JS timestamps
			wantedEvents[i].start = wantedEvents[i].start * 1000;
			wantedEvents[i].end = wantedEvents[i].end * 1000;
		}
	} else {
		for (var i = 0; i < wantedEvents.length; i++) {
			// Convert from UNIX timestamps to ISO strings with the right timezone
			wantedEvents[i].start = moment.tz(wantedEvents[i].start * 1000, timezone);
			wantedEvents[i].end = moment.tz(wantedEvents[i].end * 1000, timezone);
		}
	}

	if (eventColoring == "eventType") {
		for (var i = 0; i < wantedEvents.length; i++) {
			// Set the text color to black
			wantedEvents[i].textColor = 'black';
			// Subtract 1 to convert between WJR's IDs and our array indexes
			wantedEvents[i].color = eventTypeColors[wantedEvents[i].event_classification.id - 1];
		}
	}

	return wantedEvents;
}

function addChildrenToArray(parentId) {
	var children = determineChildren(parentId);
	for (var j = 0; j < children.length; j++) {
		updateArray(children[j], true);
		addChildrenToArray(children[j]);
	}
}

jQuery(document).ready(function() {
	// page is now ready

	/* Create and register our custom settings view */
	createSettingsView();

	/* Fetch clubs list and update as necessary */
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			allClubs = this.responseXML.getElementsByTagName("Organisation");
			for (var i = 0; i < clubIds.length; i++) {
				addChildrenToArray(clubIds[i]);
			}
			/* Update the events */
			jQuery('#calendar').fullCalendar( 'refetchEvents' );
		}
	};
	xmlhttp.open("GET", "https://whyjustrun.ca/iof/3.0/organization_list.xml", true);
	xmlhttp.send();

	/* Default to month view when at least 783px wide, otherwise list view */
	var view = 'month';
	if (jQuery( document ).width() < 783) {
		view = 'listMonth';
	}

// initialize the calendar...
jQuery('#calendar').fullCalendar({
	header: {
		left: 'prev,next',
		center: 'title',
		right: 'month,listMonth,settings'
	},

	defaultView: view,

	timezone: 'local',

	eventSources: [
		{
			events: function(start, end, timezone, callback) {
				jQuery.ajax({
					url: 'https://whyjustrun.ca/events.json',
					type: 'GET',
					data: {
						prefix_club_acronym: appendClubName,
						// our feed requires UNIX timestamps
						start: start.unix(),
						end: end.unix()
					},
					success: function(events) {
						callback(convertTimestamps(events, timezone));
					}
				});
			}
		},
	]
});
});
