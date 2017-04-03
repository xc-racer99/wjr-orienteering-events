<?php
/*
Plugin Name: WhyJustRun Orienteering Events
Description: Basic plugin to create a FullCalendar and using the shortcode [wjr-fullcalendar].  See README for full options
Author: Jonathan Bakker
Version: 1.1
*/

function wjr_events_shortcodes_init()
{
	function wjr_fullmaps_shortcode($atts = [], $content = null)
	{
		// Enqueue the script in the footer
		wp_enqueue_script('wjr-fullcalendar', plugins_url('wjrFullCalendar.js', __FILE__), array('fullcalendar-base', 'moment.tz', 'wjr-fullcalendar-settings'), null, true);

		// Add the div
		$toreturn .= '<div id="calendar"></div>';

		// Setup the clubIds, clubColors, appendClubName
		$toreturn .= '<script>';

		$numAtts = count($atts);

		if ($numAtts >= 1 && is_numeric($atts[0])) {
			$toreturn .= 'var topId = [' . $atts[0] . '];';
		} else {
			/* Default to Orienteering Canada */
			$toreturn .= 'var topId = 76;';
		}

		if ($numAtts >= 2) {
			$toreturn .= 'var clubIds = [' . $atts[1] . '];';
		} else {
			/* Default to Orienteering Canada */
			$toreturn .= 'var clubIds = [76];';
		}

		if ($numAtts >= 3) {
			$toreturn .= 'var appendClubName = ' . $atts[2] . ';';
		} else {
			$toreturn .= 'var appendClubName = true;';
		}

		if ($numAtts >= 4) {
			$toreturn .= 'var eventColoring = "' . $atts[3] . '";';
		} else {
			$toreturn .= 'var eventColoring = "eventType";';
		}

		$toreturn .= '</script>';

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
		wp_register_script('wjr-fullcalendar-settings', plugins_url('settingsPage.js', __FILE__), null, true);

		// FullCalendar Base
		wp_register_script('fullcalendar-base', '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.3.1/fullcalendar.min.js', array('moment', 'jquery'), true);
		wp_enqueue_style('fullcalendar-style', '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.3.1/fullcalendar.min.css');
}
add_action('wp_enqueue_scripts', 'wjr_events_enqueue_resources');
