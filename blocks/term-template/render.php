<?php
/**
 * Render: wp-term-loop/term-template.
 *
 * Queries posts belonging to the current term and renders
 * inner blocks once per post, passing postId / postType context.
 *
 * @var array    $attributes
 * @var string   $content
 * @var WP_Block $block
 */

defined( 'ABSPATH' ) || exit;

$term_id    = $block->context['wp-term-loop/termId'] ?? 0;
$taxonomy   = $block->context['wp-term-loop/taxonomy'] ?? '';
$tax_filter = $block->context['wp-term-loop/taxFilter'] ?? [];

if ( ! $term_id || ! $taxonomy ) {
	return;
}

$post_type      = $attributes['postType'] ?? 'post';
$posts_per_page = (int) ( $attributes['perPage'] ?? -1 );
$orderby        = $attributes['orderby'] ?? 'title';
$order          = $attributes['order'] ?? 'ASC';

$query_args = [
	'post_type'      => $post_type,
	'posts_per_page' => $posts_per_page,
	'orderby'        => $orderby,
	'order'          => $order,
	'tax_query'      => [
		[
			'taxonomy' => $taxonomy,
			'terms'    => $term_id,
		],
	],
];

// Apply taxFilter — additional taxonomy conditions from the parent loop.
if ( ! empty( $tax_filter ) && is_array( $tax_filter ) ) {
	foreach ( $tax_filter as $filter_taxonomy => $filter_terms ) {
		$query_args['tax_query'][] = [
			'taxonomy' => $filter_taxonomy,
			'field'    => 'slug',
			'terms'    => (array) $filter_terms,
		];
	}
}

/**
 * Filters the WP_Query arguments for the Term Template block.
 *
 * Other plugins (e.g. edu-staff) can hook here to add
 * extra tax_query conditions, meta_query, etc.
 *
 * @param array    $query_args WP_Query arguments.
 * @param array    $attributes Block attributes.
 * @param WP_Block $block      Block instance.
 */
$query_args = apply_filters( 'wp_term_loop_post_query_args', $query_args, $attributes, $block );

$posts = get_posts( $query_args );

if ( ! $posts ) {
	return;
}

$wrapper = get_block_wrapper_attributes();
$output  = '';

global $post;
foreach ( $posts as $post ) {
	setup_postdata( $post );

	foreach ( $block->inner_blocks as $inner_block ) {
		$output .= ( new WP_Block(
			$inner_block->parsed_block,
			[
				'postType' => $post->post_type,
				'postId'   => $post->ID,
			]
		) )->render();
	}
}
wp_reset_postdata();

echo "<div {$wrapper}>{$output}</div>";
