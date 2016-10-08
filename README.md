nightmare-crawler
=====
---
It is easy to scrap things from a web page if the content of that page is formed from the server side, but things are getting difficult when you want to do the same thing to a SPA website. The content of a SPA website is generated dynamically through multiple AJAX requests, and even more, some of those requests will only be issued after a script evaluation. It's relatively hard to achive the same goal on such website by using tools like Node.js request module. This might need some kind of browser automation to ease the pain, and there are options after a brief searching:
- Phantom.js
- Nightmare.js
- WebdriverIO

At first, I choose Phantom.js as a starting point, but its API is just too cumbersome, so, after a short test, I decided to move on to Nightmare.js, and I found it very easy to be used. This repo will show you how to use Nightmare.js to scrap things from a website that requires authentication and contains dynamic content.

 (I havn't really tried WebdriverIO, but since the speed of Nightmare.js isn't that fast, maybe I'll give it a shot some time later)