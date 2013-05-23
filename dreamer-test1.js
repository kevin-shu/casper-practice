var lightBoxHTML = "";
var casper = require('casper').create();

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href')
    });
}

function sleep( seconds ) {
	var timer = new Date();
	var time = timer.getTime();
	do
		timer = new Date();
	while( (timer.getTime() - time) < (seconds * 1000) );
}

function screenShot( fileName ) {
	casper.capture( fileName, {
        top: 0,
        left: 0,
        width: 800,
        height: 1600
    });
}

casper.start('http://localhost:8080/', function() {
	this.echo("Input user's email & password...");
	var result = this.evaluate(function(){
		if (document.getElementById("loginE")) {
			document.getElementById("loginE").value="kevin78515@gmail.com";
			document.querySelector("#loginP").value="kevin78515";
			return document.getElementById("loginE").value;
		    // sleep(10);
		} else {
			// this.echo("Already login!");
		}
	});
	this.echo(result);
});

casper.then(function() {
    this.click(".loginBox .login_fn");
	this.echo("Submit user email...");
});

casper.then(function() {
	this.wait(3000, function(){
		screenShot( 'login.png' );
		var isLogin = this.evaluate(function(){
			if(document.querySelector(".blog_box")){
				return true;
			}
		});
		if (isLogin) {
	    	this.echo("Login success!");
	    	this.click("#add-blog");
			this.echo("Clicking the \"add-blog\" button");
		}
	});
});

casper.then(function() {
	this.wait(3000, function(){
		var isBlogEditor = this.evaluate( function() {
			if (document.getElementById("block-editor-box")) {
				return true;
			}
			return false;
	    });
	    if ( isBlogEditor ){
	    	this.echo("Blog-editor exist!");
			lightBoxHTML = this.evaluate( function() {
		    	return document.getElementById("block-editor-box").innerHTML;
		    });
		    screenShot( 'lb.png' );
	    }
	});
});

casper.run(function() {
    // echo results in some pretty fashion
    this.echo("Here's the light-box:");
    this.echo(lightBoxHTML).exit();
});