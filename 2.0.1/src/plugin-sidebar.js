( function ( wp ) {
    var registerPlugin = wp.plugins.registerPlugin;
    var PluginSidebar = wp.editPost.PluginSidebar;
    var el = wp.element.createElement;

    registerPlugin( 'collapsing-pages-sidebar', {
        render: function () {
            return el(
                PluginSidebar,
                {
                    name: 'collapsing-pages-sidebar',
                    icon: 'admin-post',
                    title: 'Collapsing pages sidebar',
                },
                'Meta field'
            );
        },
    } );
} )( window.wp );
