<?php
/*
Plugin Name: Collapsing Pages
Plugin URI: http://robfelty.com/plugins/collapsing-pages
Description: Uses javascript to expand and collapse pages to show the posts that belong to the link category
Author: Robert Felty
Version: 2.0.1
Author URI: http://robfelty.com
Tags: sidebar, widget, pages

Copyright 2007-2023 Robert Felty

This file is part of Collapsing Pages

		Collapsing Pages is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or (at your
    option) any later version.

    Collapsing Pages is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Collapsing Pages; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/


global $collapsPageVersion;
$collapsPageVersion = '2.0.1';
if (!is_admin()) {
  add_action( 'wp_head', array('collapsPage','get_head'));
} else {
  // call upgrade function if current version is lower than actual version
  $dbversion = get_option('collapsPageVersion');
  if (!$dbversion || $collapsPageVersion != $dbversion)
    collapsPage::init();
}
add_action('init', array('collapsPage','init_textdomain'));
add_action('activate_collapsing-pages/collapsPage.php', array('collapsPage','init'));

class collapsPage {
	public static function init_textdomain() {
	  $plugin_dir = basename(dirname(__FILE__));
	  load_plugin_textdomain( 'collapsing-pages', 'wp-content/plugins/' . $plugin_dir, $plugin_dir );
	}

	public static function init() {
    global $collapsPageVersion;
	  include('collapsPageStyles.php');
		$defaultStyles=compact('selected','default','block','noArrows','custom');
    $dbversion = get_option('collapsPageVersion');
    if ($collapsPageVersion != $dbversion && $selected!='custom') {
      $style = $defaultStyles[$selected];
      update_option( 'collapsPageStyle', $style);
      update_option( 'collapsPageVersion', $collapsPageVersion);
    }
		$defaultStyles=compact('selected','default','block','noArrows','custom');
    if( function_exists('add_option') ) {
      update_option( 'collapsPageOrigStyle', $style);
      update_option( 'collapsPageDefaultStyles', $defaultStyles);
    }
    if (!get_option('collapsPageStyle')) {
      add_option( 'collapsPageStyle', $style);
		}
    if (!get_option('collapsPageSidebarId')) {
      add_option( 'collapsPageSidebarId', 'sidebar');
		}
    if (!get_option('collapsPageVersion')) {
      add_option( 'collapsPageVersion', $collapsPageVersion);
		}
	}


	public static function get_head() {
    echo "<style type='text/css'>\n";
    echo collapsPage::set_styles();
    echo "</style>\n";

	}

  public static function set_styles() {
    $widget_options = get_option('widget_collapspage');
    include('collapsPageStyles.php');
    $css = '';
    $oldStyle=true;
    foreach ($widget_options as $key=>$value) {
      $id = "widget-collapspage-$key-top";
      if (isset($value['style'])) {
        $oldStyle=false;
        $style = $defaultStyles[$value['style']];
        $css .= str_replace('{ID}', '#' . $id, $style);
      }
    }
    if ($oldStyle)
      $css=stripslashes(get_option('collapsPageStyle'));
    return($css);
  }

	public static function render_callback( $attributes ) {
		include('collapsPageStyles.php');
		$html = '';
		$number = 1234;
		$wrapper_attributes = get_block_wrapper_attributes();
		$instance = $attributes;
		$instance['number'] = $number;
		$title = $instance['widgetTitle'];
		$html .= "<h2 class='widget-title'>$title</h2>";
		if ( ! empty( $attributes[ 'style' ] ) ) {
			$html .= '<style type="text/css">';
			$style = $defaultStyles[ $attributes['style'] ];
			$style = str_replace('{ID}', '#widget-collapsPage-' . $number . '-top', $style);
			$html .= "$style</style>";
		}
		$html .= "<ul id='widget-collapsPage-$number-top'>";
		$html .= collapsPage($instance, $_COOKIE, false, true );
		//$html .= "<li>extra</li>";
		$html .= "</ul>";
		return sprintf(
			'<div %1$s>%2$s</div>',
			$wrapper_attributes,
			$html
		);
	}
}


function collapsPage($args='', $cookies = null, $print = true, $callback = false ) {
	if ( is_admin() ) {
	  return;
	}
	extract($args);
	include('symbols.php');
	include_once( 'collapsPageList.php' );
	$pages  = list_pages($args);
	$url = get_settings('siteurl');
	$pages .= "<li style='display:none'><script type=\"text/javascript\">\n";
	$pages .= "// <![CDATA[\n";
	$pages .= '
	/* These variables are part of the Collapsing Pages Plugin
	* version: 2.0.1
	* revision: $Id: collapsPage.php 2927034 2023-06-16 11:42:01Z robfelty $
	* Copyright 2007-2023 Robert Felty (robfelty.com)
	*/'. "\n";
	$pages .= "var expandSym=\"$expandSym\";";
	$pages .= "var collapseSym=\"$collapseSym\";";
	if ( ! $accordion ) {
	  $accordion = '0'; // false sometimes echos as blank
	}
	$pages .= file_get_contents( dirname( __FILE__ ) . '/collapsFunctions.js' );
	$pages .= "widgetRoot = document.querySelector( '#widget-collapsPage-$number-top' );";
	$pages .= "addExpandCollapseNew(widgetRoot, '$expandSym', '$collapseSym', $accordion )";
	$pages .= ";\n// ]]>\n</script></li>\n";
	if ( $print ) {
		print $pages;
	} elseif ($callback) {
		return $pages;
	}
}

function create_block_collapsPage_block_init() {
		register_block_type(
				__DIR__ . '/build',
				[ 'render_callback' => [ collapsPage::class, 'render_callback' ] ]
		);
}
add_action( 'init', 'create_block_collapsPage_block_init' );
?>
