# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of URLs page"](https://github.com/raheelbennett/tinyapp/blob/master/docs/urls_page_while_logged_in.PNG?raw=true)
!["Screenshot of new URL creation page"](https://github.com/raheelbennett/tinyapp/blob/master/docs/create_new_url.PNG?raw=true)
!["Screenshot of URL editor page"](https://github.com/raheelbennett/tinyapp/blob/master/docs/url_edit.PNG?raw=true)
!["Screenshot of login page"](https://github.com/raheelbennett/tinyapp/blob/master/docs/login_page.PNG?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- The default port is set to 8080. To change the port for your local envivonment plesae update ln 6 in node express_server.js.
- Users must be logged in to use all functionality of the app.
- Users must have registered an account to initial use. The app will automatically log user in upon registration.
- URLs created by each user will only be visible to them and can only be edited by them. However the short URLs can be used by anyone to be redirected to the long URL. 
- The format for short URLS is: http://localhost:8080/u/b2xVn2 ("b2xVn2" is an example of URL ID and will be unique for each shortened URL).



https://github.com/raheelbennett/tinyapp/blob/master/docs/create_new_url.PNG?raw=true