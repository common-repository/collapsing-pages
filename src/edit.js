/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
//import { map, filter } from 'lodash';
import { TextControl } from '@wordpress/components';
import { withSelect, subscribe } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

import ServerSideRender from "@wordpress/server-side-render";
const { InspectorControls } = wp.blockEditor;
const { ToggleControl, PanelBody, PanelRow, CheckboxControl, SelectControl, ColorPicker, Placeholder, Spinner } = wp.components;

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {WPElement} Element to render.
 */
function Edit( props ) {
	function excludedPostTypes( postType ) {
		let excludePostTypes = [ 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation', 'nav_menu_item' ];
		if ( ! excludePostTypes.includes( postType.slug ) ) {
			return postType;
		}
	}

	function excludedTaxonomies( taxonomy ) {
		let excludeTaxonomies = [ 'nav_menu' ];
		if ( ! excludeTaxonomies.includes( taxonomy.slug ) ) {
			return taxonomy;
		}
	}

	const getPostTypeOptions = () => {
		const selectOption = {
			label: __( '- Select -' ),
			value: '',
			disabled: true,
		};
		let postTypeOptions = [];
		if ( props.postTypes ) {
			postTypeOptions = props.postTypes.filter(excludedPostTypes).map(
				item => {
					return {
						value: item.slug,
						label: item.name,
					};
				}
			);
		}
		 return [ selectOption, ...postTypeOptions ];
	 }
	 const getTaxonomyOptions = () => {
		const selectOption = {
			label: __( '- Select -' ),
			value: '',
			disabled: true,
		};
		let taxonomyOptions = [];
		if ( props.taxonomies ) {
			taxonomyOptions = props.taxonomies.filter( excludedTaxonomies ).map(
				item => {
					return {
						value: item.slug,
						label: item.name,
					};
				}
			);
		}

    return [ selectOption, ...taxonomyOptions ];
  };
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
				<ServerSideRender block="collapsing/pages" attributes={props.attributes} />
				<InspectorControls>
					<PanelBody
						title={__("Collapsing Pages settings", "collapsing-pages")}
						initialOpen={true}
					>
						<PanelRow>
							<TextControl
								label={__("Title", "collapsing-pages")}
								 autoComplete="off"
									value={ props.attributes.widgetTitle || '' }
									onChange={ ( nextValue ) => {
										props.setAttributes( { widgetTitle: nextValue } );
									} }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__("Link To Page")}
								checked={props.attributes.linkToPage}
								onChange={(value) => { props.setAttributes( { linkToPage: value } );} }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__("Show Top Level")}
								checked={props.attributes.showTopLevel}
								onChange={(value) => { props.setAttributes( { showTopLevel: value } );} }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__("Display only sub-pages from current page")}
								checked={props.attributes.currentPageOnly}
								onChange={(value) => { props.setAttributes( { currentPageOnly: value } );} }
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label={__("Sort pages by", 'collapsing-pages')}
								value={props.attributes.sort}
								options={[
									{label: __("Name", 'collapsing-pages'), value: 'pageName'},
									{label: __("Id", 'collapsing-pages'), value: 'pageId'},
									{label: __("Slug", 'collapsing-pages'), value: 'pageSlug'},
									{label: __("Menu Order", 'collapsing-pages'), value: 'menuOrder'},
								]}
								onChange={(newval) => { props.setAttributes( {sort: newval })}}
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								value={props.attributes.sortOrder}
								label={__("Sort order")}
								options={[
									{label: __("Ascending", 'collapsing-pages'), value: 'ASC'},
									{label: __("Descending", 'collapsing-pages'), value: 'DESC'},
								]}
								onChange={(newval) => { props.setAttributes( {sortOrder: newval })}}
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label={__("Expand depth", 'collapsing-pages')}
								value={props.attributes.depth}
								options={[
									{label: __("None", 'collapsing-pages'), value: '0'},
									{label: __("Sub-pages", 'collapsing-pages'), value: '1'},
									{label: __("Sub-sub-pages", 'collapsing-pages'), value: '2'},
									{label: __("Sub-sub-sub-pages", 'collapsing-pages'), value: '3'},
								]}
								onChange={(newval) => { props.setAttributes( {sort: newval })}}
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label={__("Expanding and collapsing characters")}
								value={props.attributes.expand}
								options={[
									{label: __("▶ ▼"), value: '0'},
									{label: __("+ —"), value: '1'},
									{label: __("[+] [—]"), value: '2'},
									{label: __("Images (1)"), value: '3'},
									{label: __("Images (2)"), value: '5'},
								]}
								onChange={(newval) => { props.setAttributes( {expand: newval })}}
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label={__("Style")}
								value={props.attributes.style}
								options={[
									{label: __("Theme"), value: 'theme'},
									{label: __("Kubrick"), value: 'kubrick'},
									{label: __("Twenty Ten"), value: 'twentyten'},
									{label: __("No arrows"), value: 'noArrows'},
								]}
								onChange={(newval) => { props.setAttributes( {style: newval })}}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
				<InspectorControls group="advanced">
						<PanelRow>
							<TextControl
								label={__("Truncate post title to N characters", "collapsing-pages")}
								 autoComplete="off"
									value={ props.attributes.postTitleLength || '' }
									onChange={ ( nextValue ) => {
										props.setAttributes( { postTitleLength: nextValue } );
									} }
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label={__("")}
								value={props.attributes.inExcludePage}
								options={[
									{label: __("Include"), value: 'include'},
									{label: __("Exclude"), value: 'exclude'},
								]}
								onChange={(newval) => { props.setAttributes( {inExcludePage: newval })}}
							/>
						</PanelRow>
						<PanelRow>
							<TextControl
								label={__("these pages (input slugs or ids separated by commas)", "collapsing-pages")}
								 autoComplete="off"
									value={ props.attributes.inExcludePages || '' }
									onChange={ ( nextValue ) => {
										props.setAttributes( { inExcludePages: nextValue } );
									} }
							/>
						</PanelRow>
						<PanelRow>
							<TextControl
								label={__("Auto-expand these pages (input slugs, separated by commas):", "collapsing-pages")}
								 autoComplete="off"
									value={ props.attributes.defaultExpand || '' }
									onChange={ ( nextValue ) => {
										props.setAttributes( { defaultExpand: nextValue } );
									} }
							/>
						</PanelRow>
						<PanelRow>
							<CheckboxControl
								label={__("Show debugging information")}
								checked={props.attributes.debug}
								onChange={(newval) => { props.setAttributes( {debug: newval })}}
							/>
						</PanelRow>
				</InspectorControls>
			</div>
	);
}

export default withSelect( ( select ) => {
	return {
		taxonomies: select( coreStore ).getTaxonomies( { per_page: -1 } ),
		postTypes: select( coreStore ).getPostTypes( { per_page: -1 } ),
	};
} )( Edit );
