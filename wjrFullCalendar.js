function filterByClub(event) {
	return clubIds.indexOf(event.club.id) != -1;
}

function convertTimestamps(events) {
	// If the first (presumably only) clubId is 0, we want all events
	if (clubIds[0] == 0) {
		var wantedEvents = events;
	} else {
		var wantedEvents = events.filter(filterByClub);
	}

	for (var i = 0; i < wantedEvents.length; i++) {
		// Convert from UNIX timestamps to ISO strings
		wantedEvents[i].start = moment.tz(wantedEvents[i].start * 1000, "America/Vancouver");
		wantedEvents[i].end = moment.tz(wantedEvents[i].end * 1000, "America/Vancouver");
	}


	if (clubColors.length > 0) {
		for (var i = 0; i < wantedEvents.length; i++) {
			// Set the text color to black
			wantedEvents[i].textColor = 'black';
			wantedEvents[i].color = clubColors[clubIds.indexOf(wantedEvents[i].club.id)];
		}
	}

	return wantedEvents;
}

jQuery(document).ready(function() {
	// page is now ready

	/* Default to month view when at least 783px wide, otherwise list view */
	var view = 'month';
	if (jQuery( document ).width() < 783) {
		view = 'listMonth';
	}

// initialize the calendar...
jQuery('#calendar').fullCalendar({
	header: {
		left: 'prev,next today',
		center: 'title',
		right: 'month,listMonth'
	},

	defaultView: view,

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
						callback(convertTimestamps(events));
					}
				});
			}
		},
	]
});
});
