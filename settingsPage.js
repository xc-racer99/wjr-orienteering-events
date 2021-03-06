var currentTimeZone = "local";
var allClubs;

function updateArray(clubId, checked) {
	/* Make sure clubId is an integer */
	clubId = parseInt(clubId);

	if (checked) {
		/* Add clubId to the array of ClubIds if necessary */
		if (clubIds.indexOf(clubId) == -1)
			clubIds.push(clubId);
	} else {
		/* Remove the element from the array */
		clubIds.splice(clubIds.indexOf(clubId), 1);
	}
}

function setChecked(ourClubNode, clubId) {
	var checked = ourClubNode.checked;

	/* Update the array */
	updateArray(clubId, checked);

	/* Determine child clubs */
	var childIds = ourClubNode.getAttribute("data-childClubIds").split(",");

	if (childIds[0] != "") {
		for (var i = 0; i < childIds.length; i++) {
			/* Make it the right checked status */
			var childNode = document.getElementById("label" + childIds[i]);
			childNode.checked = checked;

			/* Recurse into children */
			setChecked(childNode, childIds[i]);
		}
	}
}

function setInitialChecked() {
	for (var i = 0; i < clubIds.length; i++) {
		var node = document.getElementById("label" + clubIds[i]);
		node.checked = true;
	}
}

/* Sets up input boxes for all children starting from clubId */
function setupInputs(clubId, parentNode) {
	/* Find our club's Node */
	var clubNode;

	for (var i = 0; i < allClubs.length; i++) {
		if (allClubs[i].getElementsByTagName("Id")[0].childNodes[0].nodeValue == clubId) {
			/* Found it */
			clubNode = allClubs[i];
			break;
		}
	}

	/* Contains a comma-separated list of child club IDs */
	var childClubsArray = determineChildren(clubId);

	/* Use this for our id attribute on the checkbox */
	var name = "label" + clubId;

	/* Create an unordered list */
	var unorderedList = document.createElement("UL");
	var listItem = document.createElement("LI");
	listItem.style.listStyleType = "none";

	/* Create a label */
	var label = document.createElement("LABEL");
	label.setAttribute("for", name);
	var text = document.createTextNode(clubNode.getElementsByTagName("Name")[0].childNodes[0].nodeValue);
	label.appendChild(text);

	/* Create an input element */
	var checkbox = document.createElement("INPUT");
	checkbox.type = "checkbox";
	checkbox.name = name;
	checkbox.id = name;
	checkbox.onchange = function() { setChecked(checkbox, clubId); jQuery('#calendar').fullCalendar( 'refetchEvents' ); };

	/* Add an custom attribute containing the child club numbers so we can select/deselect a bunch at a time */
	checkbox.setAttribute("data-childClubIds", childClubsArray.toString());

	/* Append the input and label to the list item */
	listItem.appendChild(checkbox);
	listItem.appendChild(label);

	/* Append the list item to the parentNode */
	unorderedList.appendChild(listItem);
	parentNode.appendChild(unorderedList);

	/* For each child club, create an item in the list and recurse into this function */
	for (var i = 0; i < childClubsArray.length; i++) {
		setupInputs(childClubsArray[i], listItem);
	}
}

/* Returns an array containing the club IDs of all child clubs */
function determineChildren(parentClubId) {
	var childClubs = [];

	for (var i = 0; i < allClubs.length; i++) {
		var parentOrganisationIdCollection = allClubs[i].getElementsByTagName("ParentOrganisationId");

		/* Skip ones that don't have a parent */
		if (parentOrganisationIdCollection.length == 0) {
			continue;
		}

		/* If the parentId matches, add this clubId to the array */
		if (parentOrganisationIdCollection[0].childNodes[0].nodeValue == parentClubId) {
			childClubs.push(allClubs[i].getElementsByTagName("Id")[0].childNodes[0].nodeValue);
		}
	}
	return childClubs;
}

function createSettingsView() {
	var FC = jQuery.fullCalendar; // a reference to FullCalendar's root namespace
	var SettingsView = FC.View.extend({ // make a subclass of View

		renderSkeleton: function() {
			// subclasses should implement
			/* Hide the title and left-right arrows */
			jQuery(".fc-left").hide();
			jQuery(".fc-center").hide();

			/* Create a div to store all the settings */
			this.el.append('<div id="settingsPage"></div>');
			var settingsDiv = jQuery("#settingsPage");

			/* Add the event coloring selector */
			var coloringOptions = [
				["club", "Club"],
				["eventSeries", "Event Series"],
				["eventType", "Event Type"]
			];

			var eventColoringString = '<h3>Event Coloring</h3>';
			eventColoringString += '<select id="coloring-selector">';
			for (var i = 0; i < coloringOptions.length; i++) {
				if (eventColoring == coloringOptions[i][0])
					eventColoringString += '<option value="' + coloringOptions[i][0] + '" selected="selected">' + coloringOptions[i][1] + '</option>';
				else
					eventColoringString += '<option value="' + coloringOptions[i][0] + '">' + coloringOptions[i][1] + '</option>';
			}
			eventColoringString += '</select>';

			settingsDiv.append(eventColoringString);

			/* Add the timezone selector */
			var timeZones = [
				["local","Your Local Time"],
				["America/Vancouver","Pacific Time"],
				["America/Edmonton","Mountain Time"],
				["America/Winnipeg","Central Time"],
				["America/Toronto","Eastern Time"],
				["America/Halifax","Atlantic Time"],
				["America/St_Johns","Newfoundland Time"]
			];

			settingsDiv.append('<h3>Timezone</h3>');
			var timeZoneString = '<select id="timezone-selector">';
			for (var i = 0; i < timeZones.length; i++) {
				if (currentTimeZone == timeZones[i][0])
					timeZoneString += '<option value="' + timeZones[i][0] + '" selected="selected">' + timeZones[i][1] + '</option>';
				else
					timeZoneString += '<option value="' + timeZones[i][0] + '">' + timeZones[i][1] + '</option>';
			}

			timeZoneString += '</select>';

			settingsDiv.append(timeZoneString);

			/* Add the club selector */
			settingsDiv.append('<h3>Clubs</h3><div id="club-selector"></div>');

			/* Setup the input boxes */
			setupInputs(topId, document.getElementById("club-selector"));

			/* Select the right checkboxes */
			setInitialChecked();

			/* TODO: Should this be elsewhere? */
			jQuery('#timezone-selector').on('change', function() {
				jQuery('#calendar').fullCalendar('option', 'timezone', this.value || false);
				currentTimeZone = this.value;
			});

			jQuery('#coloring-selector').on('change', function() {
				eventColoring = this.value;
				jQuery('#calendar').fullCalendar( 'refetchEvents' );
			});
		},

		unrenderSkeleton: function() {
			// subclasses should implement
			jQuery("#settingsPage").remove();

			/* Show title and arrows again */
			jQuery(".fc-left").show();
			jQuery(".fc-center").show();
		},

	});

	FC.views.settings = SettingsView; // register our class with the view system
}
