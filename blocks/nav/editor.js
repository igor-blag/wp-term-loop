( function () {
	const { registerBlockType } = wp.blocks;
	const { createElement: el, Fragment } = wp.element;
	const { InspectorControls, useBlockProps } = wp.blockEditor;
	const { PanelBody, SelectControl, ToggleControl } = wp.components;
	const { useSelect } = wp.data;
	const { __ } = wp.i18n;

	registerBlockType( 'wp-term-loop/nav', {
		edit( props ) {
			const { attributes, setAttributes } = props;

			// Fetch all public taxonomies.
			const taxonomies = useSelect( function ( select ) {
				const allTaxonomies = select( 'core' ).getTaxonomies( { per_page: -1 } );
				if ( ! allTaxonomies ) {
					return [];
				}
				return allTaxonomies.filter( function ( t ) {
					return t.visibility.show_ui;
				} );
			}, [] );

			const taxonomyOptions = taxonomies.map( function ( t ) {
				return { label: t.name, value: t.slug };
			} );

			// Fetch terms for preview.
			const terms = useSelect( function ( select ) {
				return select( 'core' ).getEntityRecords( 'taxonomy', attributes.taxonomy, {
					per_page: 50,
					orderby: attributes.orderby === 'menu_order' ? 'name' : attributes.orderby,
					order: attributes.order,
					hide_empty: attributes.hideEmpty,
				} ) || [];
			}, [ attributes.taxonomy, attributes.orderby, attributes.order, attributes.hideEmpty ] );

			const blockProps = useBlockProps( {
				className: 'wp-term-loop-nav',
			} );

			// Render preview list.
			var listItems = terms.map( function ( term ) {
				var label = term.name;
				if ( attributes.showCount ) {
					label += ' (' + term.count + ')';
				}
				return el( 'li', { key: term.id, className: 'wp-term-loop-nav__item' },
					el( 'a', {
						className: 'wp-term-loop-nav__link',
						href: '#term-' + term.slug,
						onClick: function ( e ) { e.preventDefault(); },
					}, label )
				);
			} );

			var preview = terms.length
				? el( 'ul', { className: 'wp-term-loop-nav__list' }, listItems )
				: el( 'p', { style: { color: '#999' } }, __( 'No terms found.', 'wp-term-loop' ) );

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __( 'Navigation Settings', 'wp-term-loop' ) },
						el( SelectControl, {
							label: __( 'Taxonomy', 'wp-term-loop' ),
							value: attributes.taxonomy,
							options: taxonomyOptions,
							onChange: function ( val ) {
								setAttributes( { taxonomy: val } );
							},
						} ),
						el( SelectControl, {
							label: __( 'Link mode', 'wp-term-loop' ),
							value: attributes.linkMode,
							options: [
								{ label: __( 'Anchor links (same page)', 'wp-term-loop' ), value: 'anchors' },
								{ label: __( 'Archive pages', 'wp-term-loop' ), value: 'archives' },
							],
							onChange: function ( val ) {
								setAttributes( { linkMode: val } );
							},
						} ),
						el( SelectControl, {
							label: __( 'Order by', 'wp-term-loop' ),
							value: attributes.orderby,
							options: [
								{ label: __( 'Name', 'wp-term-loop' ), value: 'name' },
								{ label: __( 'Slug', 'wp-term-loop' ), value: 'slug' },
								{ label: __( 'Count', 'wp-term-loop' ), value: 'count' },
								{ label: __( 'Term ID', 'wp-term-loop' ), value: 'term_id' },
								{ label: __( 'Menu order', 'wp-term-loop' ), value: 'menu_order' },
							],
							onChange: function ( val ) {
								setAttributes( { orderby: val } );
							},
						} ),
						el( SelectControl, {
							label: __( 'Order', 'wp-term-loop' ),
							value: attributes.order,
							options: [
								{ label: __( 'A → Z', 'wp-term-loop' ), value: 'ASC' },
								{ label: __( 'Z → A', 'wp-term-loop' ), value: 'DESC' },
							],
							onChange: function ( val ) {
								setAttributes( { order: val } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Hide empty terms', 'wp-term-loop' ),
							checked: attributes.hideEmpty,
							onChange: function ( val ) {
								setAttributes( { hideEmpty: val } );
							},
						} ),
						el( ToggleControl, {
							label: __( 'Show post count', 'wp-term-loop' ),
							checked: attributes.showCount,
							onChange: function ( val ) {
								setAttributes( { showCount: val } );
							},
						} )
					)
				),
				el( 'nav', blockProps, preview )
			);
		},

		save() {
			return null; // Dynamic block — rendered on server.
		},
	} );
} )();
