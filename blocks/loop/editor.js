( function () {
	const { registerBlockType } = wp.blocks;
	const { createElement: el, Fragment } = wp.element;
	const { InspectorControls, useBlockProps, useInnerBlocksProps } = wp.blockEditor;
	const { PanelBody, SelectControl, ToggleControl } = wp.components;
	const { useSelect } = wp.data;

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
						placeholder: 'Term name (use binding)',
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
						{ title: 'Term Query' },
						el( SelectControl, {
							label: 'Taxonomy',
							value: attributes.taxonomy,
							options: taxonomyOptions,
							onChange: function ( val ) {
								setAttributes( { taxonomy: val } );
							},
						} ),
						el( SelectControl, {
							label: 'Order by',
							value: attributes.orderby,
							options: [
								{ label: 'Name', value: 'name' },
								{ label: 'Slug', value: 'slug' },
								{ label: 'Count', value: 'count' },
								{ label: 'Term ID', value: 'term_id' },
								{ label: 'Menu order', value: 'menu_order' },
							],
							onChange: function ( val ) {
								setAttributes( { orderby: val } );
							},
						} ),
						el( SelectControl, {
							label: 'Order',
							value: attributes.order,
							options: [
								{ label: 'A → Z', value: 'ASC' },
								{ label: 'Z → A', value: 'DESC' },
							],
							onChange: function ( val ) {
								setAttributes( { order: val } );
							},
						} ),
						el( ToggleControl, {
							label: 'Hide empty terms',
							checked: attributes.hideEmpty,
							onChange: function ( val ) {
								setAttributes( { hideEmpty: val } );
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
