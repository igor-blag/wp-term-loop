<?php
/**
 * Render: wp-term-loop/nav.
 *
 * Displays a list of taxonomy terms as navigation links.
 * Two modes:
 *   - "anchors"  → links to #term-{slug} on the same page (pairs with wp-term-loop/loop)
 *   - "archives" → links to term archive pages (get_term_link)
 *
 * @var array    $attributes
 * @var string   $content
 * @var WP_Block $block
 */

defined( 'ABSPATH' ) || exit;

$taxonomy   = $attributes['taxonomy'] ?? 'category';
$link_mode  = $attributes['linkMode'] ?? 'anchors';
$orderby    = $attributes['orderby'] ?? 'name';
$order      = $attributes['order'] ?? 'ASC';
$hide_empty = $attributes['hideEmpty'] ?? true;
$show_count = $attributes['showCount'] ?? false;

$term_args = [
	'taxonomy'   => $taxonomy,
	'orderby'    => $orderby,
	'order'      => $order,
	'hide_empty' => $hide_empty,
];

/** This filter is documented in blocks/loop/render.php */
$term_args = apply_filters( 'wp_term_loop_query_args', $term_args, $attributes, $block );

$terms = get_terms( $term_args );

if ( empty( $terms ) || is_wp_error( $terms ) ) {
	return;
}

$wrapper = get_block_wrapper_attributes( [
	'class' => 'wp-term-loop-nav',
	'role'  => 'navigation',
	'aria-label' => esc_attr(
		sprintf(
			/* translators: %s: taxonomy label */
			__( '%s navigation', 'wp-term-loop' ),
			get_taxonomy( $taxonomy )->labels->name ?? $taxonomy
		)
	),
] );

$items = '';
foreach ( $terms as $term ) {
	if ( 'archives' === $link_mode ) {
		$href = get_term_link( $term );
		if ( is_wp_error( $href ) ) {
			continue;
		}
	} else {
		$href = '#term-' . $term->slug;
	}

	$label = esc_html( $term->name );
	if ( $show_count ) {
		$label .= ' <span class="wp-term-loop-nav__count">(' . (int) $term->count . ')</span>';
	}

	$items .= '<li class="wp-term-loop-nav__item">'
		. '<a class="wp-term-loop-nav__link" href="' . esc_url( $href ) . '">' . $label . '</a>'
		. '</li>';
}

echo "<nav {$wrapper}><ul class=\"wp-term-loop-nav__list\">{$items}</ul></nav>";
