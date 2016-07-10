requirejs.config({
    baseUrl: '~/Scripts',
    paths: {
        app: '~/Scripts/propios'
    }
});

requirejs(['admin'],
	function () {
	    requirejs([
			'users',
	    ]);
	}
);