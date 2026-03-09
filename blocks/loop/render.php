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

$taxonomy       = $attributes['taxonomy'] ?? 'category';
$orderby        = $attributes['orderby'] ?? 'name';
$order          = $attributes['order'] ?? 'ASC';
$hide_empty     = $attributes['hideEmpty'] ?? true;
$parent         = (int) ( $attributes['parent'] ?? 0 );
$tax_filter     = $attributes['taxFilter'] ?? [];
$terms_per_page = (int) ( $attributes['termsPerPage'] ?? 0 );

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
 * When taxFilter is set AND hide_empty is true, we need to account for
 * terms that have posts matching the filter. A term might have posts in
 * general but none matching the taxFilter — it should be hidden.
 * We handle this by not relying on WP's hide_empty (which only checks
 * total count) and instead filtering after the query when taxFilter is active.
 */
$filter_empty_manually = $hide_empty && ! empty( $tax_filter );
if ( $filter_empty_manually ) {
	$term_args['hide_empty'] = false;
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

// When taxFilter is active and hide_empty, filter out terms with no matching posts.
if ( $filter_empty_manually ) {
	$post_type = 'post';
	// Try to read postType from the first term-template inner block.
	foreach ( $block->inner_blocks as $ib ) {
		if ( 'wp-term-loop/term-template' === $ib->name ) {
			$post_type = $ib->parsed_block['attrs']['postType'] ?? 'post';
			break;
		}
	}

	$terms = array_filter( $terms, function ( $term ) use ( $taxonomy, $tax_filter, $post_type ) {
		$check_args = [
			'post_type'      => $post_type,
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'tax_query'      => [
				[
					'taxonomy' => $taxonomy,
					'terms'    => $term->term_id,
				],
			],
		];
		foreach ( $tax_filter as $filter_taxonomy => $filter_terms ) {
			$check_args['tax_query'][] = [
				'taxonomy' => $filter_taxonomy,
				'field'    => 'slug',
				'terms'    => (array) $filter_terms,
			];
		}
		return ! empty( get_posts( $check_args ) );
	} );

	$terms = array_values( $terms );
}

// ── Pagination ──────────────────────────────────────────────────────────────

$total_terms = count( $terms );
$current_page = 1;
$total_pages  = 1;

if ( $terms_per_page > 0 && $total_terms > $terms_per_page ) {
	$page_param   = 'term_page';
	$current_page = max( 1, (int) ( $_GET[ $page_param ] ?? 1 ) );
	$total_pages  = (int) ceil( $total_terms / $terms_per_page );
	$current_page = min( $current_page, $total_pages );
	$offset       = ( $current_page - 1 ) * $terms_per_page;
	$terms        = array_slice( $terms, $offset, $terms_per_page );
}

// ── Render ───────────────────────────────────────────────────────────────────

$wrapper = get_block_wrapper_attributes();
$output  = '';

foreach ( $terms as $term ) {
	$term_context = [
		'wp-term-loop/termId'    => $term->term_id,
		'wp-term-loop/taxonomy'  => $taxonomy,
		'wp-term-loop/taxFilter' => $tax_filter,
	];

	$term_output = '';
	foreach ( $block->inner_blocks as $inner_block ) {
		$term_output .= ( new WP_Block(
			$inner_block->parsed_block,
			$term_context
		) )->render();
	}

	$output .= '<div class="wp-term-loop-section" id="term-' . esc_attr( $term->slug ) . '">'
		. $term_output . '</div>';
}

// ── Pagination nav ───────────────────────────────────────────────────────────

if ( $total_pages > 1 ) {
	$output .= '<nav class="wp-term-loop-pagination" aria-label="' . esc_attr__( 'Term pagination', 'wp-term-loop' ) . '">';
	for ( $i = 1; $i <= $total_pages; $i++ ) {
		$url = add_query_arg( $page_param, $i );
		if ( $i === $current_page ) {
			$output .= '<span class="wp-term-loop-pagination__current" aria-current="page">' . $i . '</span>';
		} else {
			$output .= '<a class="wp-term-loop-pagination__link" href="' . esc_url( $url ) . '">' . $i . '</a>';
		}
	}
	$output .= '</nav>';
}

echo "<div {$wrapper}>{$output}</div>";
