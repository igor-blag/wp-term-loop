( function () {
	const { registerBlockType } = wp.blocks;
	const { createElement: el, Fragment } = wp.element;
	const { InspectorControls, useBlockProps, useInnerBlocksProps } = wp.blockEditor;
	const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
	const { useSelect } = wp.data;
	const { __ } = wp.i18n;

	registerBlockType( 'wp-term-loop/loop', {
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

			var defaultLayout = { type: 'constrained' };
			var usedLayout = attributes.layout || defaultLayout;

			const blockProps = useBlockProps();
			const innerBlocksProps = useInnerBlocksProps( blockProps, {
				layout: usedLayout,
				template: [
					[ 'core/heading', {
						level: 2,
						placeholder: __( 'Term name (use binding)', 'wp-term-loop' ),
						metadata: {
							bindings: {
								content: {
									source: 'term-loop/term-data',
									args: { key: 'name' },
								},
							},
						},
					} ],
					[ 'wp-term-loop/term-template' ],
				],
				templateLock: false,
			} );

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __( 'Term Query', 'wp-term-loop' ) },
						el( SelectControl, {
							label: __( 'Taxonomy', 'wp-term-loop' ),
							value: attributes.taxonomy,
							options: taxonomyOptions,
							onChange: function ( val ) {
								setAttributes( { taxonomy: val } );
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
						el( TextControl, {
							label: __( 'Terms per page (0 = all)', 'wp-term-loop' ),
							type: 'number',
							value: String( attributes.termsPerPage || 0 ),
							onChange: function ( val ) {
								setAttributes( { termsPerPage: parseInt( val ) || 0 } );
							},
						} )
					)
				),
				el( 'div', innerBlocksProps )
			);
		},

		save() {
			return el( wp.blockEditor.InnerBlocks.Content );
		},
	} );
} )();
