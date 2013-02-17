(function ( w ) {
    "use strict";

    var popup = {};

    popup.templates = {};

    popup.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

    /**
     * primitive template function
     * @param html String
     * @return {Function}
     */
    popup.templateFn = function ( html ) {
        return function ( o ) {
            var res = html;
            for ( var i in o ) {
                res = res.replace( new RegExp( "{{" + i + "}}", "g" ), o[i] );
            }
            return res;
        }
    };

    /**
     * converts string like "2012-02-1" to date
     * @param str
     * @return {Date}
     */
    popup.dateFromString = function ( str ) {
        var a = str.split( "-" ).map( function ( e ) {
            return parseInt( e, 10 );
        } );
        a[1] -= 1;
        return new Date( a[0], a[1], a[2] );
    };

    popup.init = function () {
        var templates = document.querySelectorAll( "[data-tmpl-name]" );
        for ( var i = 0; i < templates.length; i++ ) {
            var name = templates[i].getAttribute( "data-tmpl-name" );
            popup.templates[name] = popup.templateFn( templates[i].outerHTML );
        }
    };

    popup.drawWeather = function ( data ) {
        if ( !data.geolocation || !data.weather ) return;
        var headerTmpl = popup.templates.geo;
        var header = document.querySelector( "#header" );
        var tmpl = popup.templates.weather;
        var container = document.querySelector( "#container" );
        var weatherArray = data.weather;
        header.innerHTML = headerTmpl( data.geolocation );
        for ( var i = 0; i < weatherArray.length; i++ ) {
            var o = weatherArray[i];
            o.day = popup.days[ popup.dateFromString( o.date ).getDay() ];
            o.condition = o.weatherDesc[0].value;
            o.img = o.weatherIconUrl[0].value;
            var el = document.createElement( 'div' );
            el.innerHTML = tmpl( o );
            container.appendChild( el );
        }
    };

    KangoAPI.onReady( function () {
        popup.init();
        kango.invokeAsync( 'app.getInfo', '', function ( val ) {
            popup.drawWeather( val );
        } );
    } );

})( window );
