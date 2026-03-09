( function () {
	const { registerBlockType } = wp.blocks;
	const { createElement: el, Fragment } = wp.element;
	const { InspectorControls, useBlockProps, useInnerBlocksProps } = wp.blockEditor;
	const { PanelBody, SelectControl, TextControl } = wp.components;
	const { useSelect } = wp.data;

	registerBlockType( 'wp-term-loop/term-template', {
		edit( props ) {
			const { attributes, setAttributes } = props;

			// Fetch all public post types.
			const postTypes = useSelect( function ( select ) {
				var allTypes = select( 'core' ).getPostTypes( { per_page: -1 } );
				if ( ! allTypes ) {
					return [];
				}
				return allTypes.filter( function ( pt ) {
					return pt.viewable && 'attachment' !== pt.slug;
				} );
			}, [] );

			const postTypeOptions = postTypes.map( function ( pt ) {
				return { label: pt.name, value: pt.slug };
			} );

			const blockProps = useBlockProps();
			const innerBlocksProps = useInnerBlocksProps( blockProps, {
				template: [
					[ 'core/group', {}, [
						[ 'core/post-title', { level: 3 } ],
						[ 'core/post-excerpt' ],
					] ],
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
						{ title: 'Post Query' },
						el( SelectControl, {
							label: 'Post Type',
							value: attributes.postType,
							options: postTypeOptions,
							onChange: function ( val ) {
								setAttributes( { postType: val } );
							},
						} ),
						el( SelectControl, {
							label: 'Order by',
							value: attributes.orderby,
							options: [
								{ label: 'Title', value: 'title' },
								{ label: 'Date', value: 'date' },
								{ label: 'Menu order', value: 'menu_order' },
								{ label: 'Modified', value: 'modified' },
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
						el( TextControl, {
							label: 'Posts per term (-1 = all)',
							type: 'number',
							value: String( attributes.perPage ),
							onChange: function ( val ) {
								setAttributes( { perPage: parseInt( val ) || -1 } );
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
