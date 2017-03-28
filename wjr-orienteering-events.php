<?php
/*
Plugin Name: WhyJustRun Orienteering Events
Description: Basic plugin to create a FullCalendar and/or events list using the shortcodes [wjr-fullcalendar] and [wjr-eventslist]
Author: Jonathan Bakker
Version: 1.0
*/

function wjr_events_shortcodes_init()
{
	function wjr_fullmaps_shortcode($atts = [], $content = null)
	{
		// Enqueue the script in the footer
		wp_enqueue_script('wjr-fullcalendar', plugins_url('wjrFullCalendar.js', __FILE__), array('fullcalendar-base', 'moment.tz'), null, true);

		// Add the div
		$toreturn = '<div id="calendar"></div>';

		// Add the clubIds to an array
		$toreturn .= '<script>var clubIds = [';
		for($i = 0; $i < count($atts); $i++)
			$toreturn .= $atts[$i] . ',';
		$toreturn .= '];</script>';

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

		// FullCalendar Base
		wp_register_script('fullcalendar-base', '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.3.0/fullcalendar.min.js', array('moment', 'jquery'), true);
		wp_enqueue_style('fullcalendar-style', '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.3.0/fullcalendar.min.css');

}
add_action('wp_enqueue_scripts', 'wjr_events_enqueue_resources');
