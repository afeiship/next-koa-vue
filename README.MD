#next-koa-vue
An app page architecture based on next &amp; koa &amp; vue.


##editor settings:
+ es6 framework env;


##config:
+ Host:127.0.0.1	www.dev.com

+ nginx:
```conf

  server {
  	listen 		80;
  	server_name 	www.dev.com;
  	root 		~/github/next-koa-vue/dev;
      location ~* \ {
          add_header  Cache-Control private;
          add_header  Cache-Control no-store;
          expires -1;
      }

  	location ~* \.php {
  		proxy_pass 	http://127.0.0.1:8989;
  	}
  }

```
+ cd ~/github/next-koa-vue
+ /usr/local/bin/node site/init.js `8989`
+ npm install & bower install
+ gulp


##issues:
+ need css autoprefixer       [2016-04-15:ok]
+ svg to font
+ jade-mixin
+ gulp serve
+ browser sync
+ responsive & rem layout


##resource:
+ http://mahua.jser.me/
