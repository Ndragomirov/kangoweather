var app = {};

app.xhr = kango.xhr;

//app.log = kango.console.log;

app.noop = function noop() {

};

app.extend = function () {
    var source = arguments[0];
    for ( var i = 1; i < arguments.length; i++ ) {
        for ( var j in arguments[i] ) {
            if ( arguments[i].hasOwnProperty( j ) ) {
                source[j] = arguments[i][j];
            }
        }
    }
};


//TODO display current temperature as badge value
app.setBadge = function ( text ) {
    kango.ui.browserButton.setBadgeValue( text );
};

app.init = function () {
    app.getUserInfo( function ( err, data ) {
        if ( err ) return err;
        app.data.geolocation = data;
//        app.log( data );
        app.updateWeatherInfo( app.data.geolocation.host, function ( err, data ) {
            if ( err ) return err;
            app.data.weather = data;
        } );
    } );
};

app.data = {};
app.data.geolocation = null;
app.data.weather = null;

app.getInfo = function () {
    return app.data;
};

/**
 * @param ip {String}
 * @param cb {Function}
 */
app.updateWeatherInfo = function ( ip, cb ) {
    var opts = {
        method     : "GET",
        url        : "http://free.worldweatheronline.com/feed/weather.ashx",
        contentType: "json",
        params     : {
            "num_of_days": 4,
            "key"        : "6bcb92474d121710131702",
            "format"     : "json",
            "q"          : ip,
            "_"          : Math.random()
        },
        async      : true
    };

    cb = cb || app.noop;

    app.xhr.send( opts, function ( res ) {
//        app.log( res );

        if ( res.status !== 200 ) {
            cb( res.status );
        } else {
            cb( null, res.response.data.weather );
        }
    } );
};


/**
 * returns user geolocation and IP info
 * @param cb {Function}
 */
app.getUserInfo = function ( cb ) {
    var opts = {
        method     : "GET",
        url        : "http://smart-ip.net/geoip-json",
        contentType: "json",
        async      : true
    };

    cb = cb || app.noop;

    app.xhr.send( opts, function ( res ) {
//        app.log( res );

        if ( res.status !== 200 ) {
            cb( res.status );
        } else {
            cb( null, res.response );
        }

    } );
};

app.init();