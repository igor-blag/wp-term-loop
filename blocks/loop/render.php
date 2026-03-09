<?php
/**
 * Render: wp-term-loop/loop.
 *
 * Queries taxonomy terms and renders inner blocks once per term,
 * passing term context (wp-term-loop/termId) to child blocks.
 *
 * @var array    $attributes
 * @var string   $content
 * @var WP_Block $block
 */

defined( 'ABSPATH' ) || exit;

$taxonomy   = $attributes['taxonomy'] ?? 'category';
$orderby    = $attributes['orderby'] ?? 'name';
$order      = $attributes['order'] ?? 'ASC';
$hide_empty = $attributes['hideEmpty'] ?? true;
$parent     = (int) ( $attributes['parent'] ?? 0 );

$term_args = [
	'taxonomy'   => $taxonomy,
	'orderby'    => $orderby,
	'order'      => $order,
	'hide_empty' => $hide_empty,
];

if ( $parent ) {
	$term_args['parent'] = $parent;
}

/**
 * Filters the get_terms() arguments for the Term Loop block.
 *
 * @param array    $term_args  Arguments passed to get_terms().
 * @param array    $attributes Block attributes.
 * @param WP_Block $block      Block instance.
 */
$term_args = apply_filters( 'wp_term_loop_query_args', $term_args, $attributes, $block );

$terms = get_terms( $term_args );

if ( empty( $terms ) || is_wp_error( $terms ) ) {
	return;
}

$wrapper = get_block_wrapper_attributes();
$output  = '';

foreach ( $terms as $term ) {
	$term_context = [
		'wp-term-loop/termId'   => $term->term_id,
		'wp-term-loop/taxonomy' => $taxonomy,
	];

	foreach ( $block->inner_blocks as $inner_block ) {
		$output .= ( new WP_Block(
			$inner_block->parsed_block,
			$term_context
		) )->render();
	}
}

echo "<div {$wrapper}>{$output}</div>";
