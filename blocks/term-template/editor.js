( function () {
	const { registerBlockType } = wp.blocks;
	const { createElement: el, Fragment } = wp.element;
	const { InspectorControls, useBlockProps, useInnerBlocksProps } = wp.blockEditor;
	const { PanelBody, SelectControl, TextControl } = wp.components;
	const { useSelect } = wp.data;
	const { __ } = wp.i18n;

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
						{ title: __( 'Post Query', 'wp-term-loop' ) },
						el( SelectControl, {
							label: __( 'Post Type', 'wp-term-loop' ),
							value: attributes.postType,
							options: postTypeOptions,
							onChange: function ( val ) {
								setAttributes( { postType: val } );
							},
						} ),
						el( SelectControl, {
							label: __( 'Order by', 'wp-term-loop' ),
							value: attributes.orderby,
							options: [
								{ label: __( 'Title', 'wp-term-loop' ), value: 'title' },
								{ label: __( 'Date', 'wp-term-loop' ), value: 'date' },
								{ label: __( 'Menu order', 'wp-term-loop' ), value: 'menu_order' },
								{ label: __( 'Modified', 'wp-term-loop' ), value: 'modified' },
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
						el( TextControl, {
							label: __( 'Posts per term (-1 = all)', 'wp-term-loop' ),
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
