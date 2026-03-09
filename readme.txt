=== WP Term Loop ===
Contributors: igb7
Tags: taxonomy, terms, query-loop, gutenberg, block-bindings
Requires at least: 6.5
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

A Query Loop for taxonomy terms. Iterate terms with inner blocks, show posts per term, and bind term data to any block.

== Description ==

WP Term Loop brings the power of the core Query Loop to **taxonomy terms**. Group your posts by category, tag, or any custom taxonomy — directly in the block editor with full InnerBlocks support.

**Two blocks:**

* **Term Loop** — iterates terms of any taxonomy. Place any blocks inside: headings, paragraphs, images, or the Term Template block.
* **Term Template** — iterates posts belonging to the current term. Works like the core Post Template: place core/post-title, core/post-excerpt, or any block inside.

**Block Binding source:**

The plugin registers `term-loop/term-data` as a Block Bindings source. Bind any block attribute to term data:

* `name` — term name
* `description` — term description
* `slug` — term slug
* `count` — post count
* `link` — term archive URL
* Any term meta key

**Example:** bind a Heading block's content to `term-loop/term-data` with key `name` — it will display the term name for each iteration.

**Developer-friendly:**

* `wp_term_loop_query_args` filter — modify the `get_terms()` arguments.
* `wp_term_loop_post_query_args` filter — modify the `get_posts()` arguments per term (add extra tax_query, meta_query, etc.).
* Standard block context: Term Template passes `postId` and `postType`, so all core post blocks (Post Title, Post Excerpt, Post Featured Image, etc.) work out of the box.

**Use cases:**

* Staff directory grouped by department
* Products grouped by category
* FAQ grouped by topic
* Portfolio grouped by skill
* Any content organized by taxonomy

== Installation ==

1. Upload the `wp-term-loop` folder to `/wp-content/plugins/`.
2. Activate the plugin through the Plugins menu.
3. In the block editor, search for "Term Loop" and insert it.
4. Select a taxonomy in the block settings sidebar.
5. Customize the inner blocks template.

== Frequently Asked Questions ==

= Does it work with custom taxonomies? =

Yes. The Term Loop block lists all public taxonomies in its settings panel. Select any registered taxonomy.

= Does it work with custom post types? =

Yes. The Term Template block lists all public post types. Select the post type that your taxonomy is associated with.

= Can I use core Post blocks inside? =

Yes. Term Template passes `postId` context, so core/post-title, core/post-excerpt, core/post-featured-image, and other post blocks work inside Term Template.

= Can I filter posts within each term? =

Yes. Use the `wp_term_loop_post_query_args` filter to add extra conditions (additional tax_query, meta_query, custom orderby, etc.).

= Does it work with Block Bindings? =

Yes. The plugin registers `term-loop/term-data` as a binding source. You can bind any supported block attribute to term name, description, slug, count, link, or any term meta key.

== Screenshots ==

1. Term Loop block in the editor with taxonomy selector.
2. Rendered output: posts grouped by taxonomy terms.

== Changelog ==

= 0.1.0 =
* Initial release.
* Term Loop block — iterates taxonomy terms with InnerBlocks.
* Term Template block — iterates posts per term with postId context.
* Block Binding source `term-loop/term-data` for term fields and meta.
* Filters: `wp_term_loop_query_args`, `wp_term_loop_post_query_args`.
