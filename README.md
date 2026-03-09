# WP Term Loop

A Query Loop for taxonomy terms in the WordPress block editor. Iterate terms with inner blocks, show posts per term, and bind term data to any block.

## What it does

WordPress has a Query Loop for posts — this plugin does the same for **taxonomy terms**. Group content by category, tag, or any custom taxonomy directly in the block editor.

## Blocks

### Term Loop

Iterates terms of any taxonomy. Place any blocks inside — headings, paragraphs, images, or the Term Template block.

**Settings:**
- Taxonomy (any registered public taxonomy)
- Order by (name, slug, count, term ID, menu order)
- Sort direction
- Hide empty terms

### Term Template

Iterates posts belonging to the current term. Works like the core Post Template — use `core/post-title`, `core/post-excerpt`, `core/post-featured-image`, or any block inside.

**Settings:**
- Post type
- Posts per term
- Order by / sort direction

## Block Bindings

The plugin registers `term-loop/term-data` as a Block Bindings source. Bind any block attribute to:

| Key           | Value                  |
|---------------|------------------------|
| `name`        | Term name              |
| `description` | Term description       |
| `slug`        | Term slug              |
| `count`       | Post count             |
| `link`        | Term archive URL       |
| `{meta_key}`  | Any term meta value    |

**Example:** bind a Heading's content to `term-loop/term-data` → key `name` — it displays the term name for each iteration.

## Filters

- **`wp_term_loop_query_args`** — modify `get_terms()` arguments
- **`wp_term_loop_post_query_args`** — modify `get_posts()` arguments per term (add extra `tax_query`, `meta_query`, etc.)

## Requirements

- WordPress 6.5+
- PHP 7.4+

## Installation

1. Upload `wp-term-loop` to `/wp-content/plugins/`
2. Activate through the Plugins menu
3. In the editor, insert "Term Loop" block

## License

GPLv3 or later
