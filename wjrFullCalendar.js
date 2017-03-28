function convertTimestamps(events) {
    for (var i = 0; i < events.length; i++) {
        events[i].start = moment.tz(events[i].start * 1000, "America/Vancouver");
        events[i].end = moment.tz(events[i].end * 1000, "America/Vancouver");
    }
    return events;
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
        // GVOC
        {
            events: function(start, end, timezone, callback) {
                jQuery.ajax({
                    url: 'https://whyjustrun.ca/club/1/events.json',
		        	type: 'GET',
                    data: {
                        prefix_club_acronym: 'true',
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
        // VICO
        {
            events: function(start, end, timezone, callback) {
                jQuery.ajax({
                    url: 'https://whyjustrun.ca/club/43/events.json',
		        	type: 'GET',
                    data: {
                        prefix_club_acronym: 'true',
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
        // SAGE
        {
            events: function(start, end, timezone, callback) {
                jQuery.ajax({
                    url: 'https://whyjustrun.ca/club/42/events.json',
		        	type: 'GET',
                    data: {
                        prefix_club_acronym: 'true',
                        // our feed requires UNIX timestamps
                        start: start.unix(),
                        end: end.unix()
                    },
                    success: function(events) {
                        callback(convertTimestamps(events));
                    }
                });
            },
        },
        // KOC
        {
            events: function(start, end, timezone, callback) {
                jQuery.ajax({
                    url: 'https://whyjustrun.ca/club/46/events.json',
		        	type: 'GET',
                    data: {
                        prefix_club_acronym: 'true',
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
        // Whistler
        {
            events: function(start, end, timezone, callback) {
                jQuery.ajax({
                    url: 'https://whyjustrun.ca/club/80/events.json',
		        	type: 'GET',
                    data: {
                        prefix_club_acronym: 'true',
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
