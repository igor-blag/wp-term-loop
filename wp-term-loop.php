<?php
/**
 * Plugin Name: WP Term Loop
 * Plugin URI: https://no-it.ru/wordpress-plugins/wp-term-loop/
 * Description: A Query Loop for taxonomy terms. Iterate terms with inner blocks, show posts per term, and bind term data to any block.
 * Version: 0.1.0
 * Author: Igor Blagoveshchensky
 * Author URI: https://no-it.ru
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: wp-term-loop
 * Domain Path: /languages
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', function (): void {
	load_plugin_textdomain( 'wp-term-loop', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

	register_block_type( __DIR__ . '/blocks/loop' );
	register_block_type( __DIR__ . '/blocks/term-template' );

	wp_set_script_translations(
		'wp-term-loop-loop-editor-script',
		'wp-term-loop',
		__DIR__ . '/languages'
	);
	wp_set_script_translations(
		'wp-term-loop-term-template-editor-script',
		'wp-term-loop',
		__DIR__ . '/languages'
	);
} );

// ── Block Binding source: term-loop/term-data ──────────────────────────────

add_action( 'init', function (): void {
	register_block_bindings_source( 'term-loop/term-data', [
		'label'              => __( 'Term Data', 'wp-term-loop' ),
		'uses_context'       => [ 'wp-term-loop/termId' ],
		'get_value_callback' => function ( array $args, WP_Block $block ): ?string {
			$term_id = $block->context['wp-term-loop/termId'] ?? 0;
			if ( ! $term_id ) {
				return null;
			}

			$term = get_term( $term_id );
			if ( ! $term || is_wp_error( $term ) ) {
				return null;
			}

			$key = $args['key'] ?? '';

			switch ( $key ) {
				case 'name':
					return $term->name;
				case 'description':
					return $term->description;
				case 'count':
					return (string) $term->count;
				case 'slug':
					return $term->slug;
				case 'link':
					$link = get_term_link( $term );
					return is_wp_error( $link ) ? null : $link;
				default:
					// Allow reading term meta by arbitrary key.
					if ( $key ) {
						$meta = get_term_meta( $term_id, $key, true );
						return '' !== $meta ? (string) $meta : null;
					}
					return null;
			}
		},
	] );
} );
