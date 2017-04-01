<?php
/*
Plugin Name: WhyJustRun Orienteering Events
Description: Basic plugin to create a FullCalendar and using the shortcode [wjr-fullcalendar].
Author: Jonathan Bakker
Version: 1.0
*/

function wjr_events_shortcodes_init()
{
	function wjr_fullmaps_shortcode($atts = [], $content = null)
	{
		// Enqueue the script in the footer
		wp_enqueue_script('wjr-fullcalendar', plugins_url('wjrFullCalendar.js', __FILE__), array('fullcalendar-base', 'moment.tz', 'club-selector'), null, true);

		// Add the div
		$toreturn .= '<div id="calendar"></div>';

		// Setup the clubIds, clubColors, appendClubName
		$toreturn .= '<script>';

		$numAtts = count($atts);

		if ($numAtts >= 1) {
			$toreturn .= 'var clubIds = [';
			$clubIds = explode(",", $atts[0]);
			for($i = 0; $i < count($clubIds); $i++)
				$toreturn .= $clubIds[$i] . ',';
			$toreturn .= '];';
		} else {
			$toreturn .= 'var clubIds = [0];';
		}

		if ($numAtts >= 2 && strncmp($atts[1], 'none', 4)) {
			$toreturn .= 'var clubColors = [';
			$colors = explode(",", $atts[1]);
			for($i = 0; $i < count($colors); $i++)
				$toreturn .= "'" . $colors[$i] . "',";
			$toreturn .= '];';
		} else {
			$toreturn .= 'var clubColors = [];';
		}

		if ($numAtts >= 3) {
			$toreturn .= 'var appendClubName = ' . $atts[2] . ';';
		} else {
			$toreturn .= 'var appendClubName = true;';
		}

		$toreturn .= '</script>';

		// Add the timezone selector and the club selector divs
		$toreturn .= "
		<div id='tz-selector-container' style='text-align: right;'>
			Timezone:
			<select id='timezone-selector'>
				<option value='local' selected='selected'>Your Local Time</option>
				<option value='America/Vancouver'>Pacific Time</option>
				<option value='America/Edmonton'>Mountain Time</option>
				<option value='America/Winnipeg'>Central Time</option>
				<option value='America/Toronto'>Eastern Time</option>
				<option value='America/Halifax'>Atlantic Time</option>
				<option value='America/St_Johns'>Newfoundland Time</option>
			</select>
		</div>
		<div id='club-selector'></div>
		";

		return $toreturn;

	}
	add_shortcode('wjr-fullcalendar', 'wjr_fullmaps_shortcode');
}
add_action('init', 'wjr_events_shortcodes_init');


function wjr_events_enqueue_resources()
{
		// Moment.js files - moment.tz for timezone conversions
		wp_register_script('moment', plugins_url('moment.min.js', __FILE__), null, true);
		wp_register_script('moment.tz', plugins_url('moment-timezone-with-data-2010-2020.js', __FILE__), null, true);
		wp_register_script('club-selector', plugins_url('clubParsing.js', __FILE__), null, true);

		// FullCalendar Base
		wp_register_script('fullcalendar-base', '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.3.0/fullcalendar.min.js', array('moment', 'jquery'), true);
		wp_enqueue_style('fullcalendar-style', '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.3.0/fullcalendar.min.css');

}
add_action('wp_enqueue_scripts', 'wjr_events_enqueue_resources');
