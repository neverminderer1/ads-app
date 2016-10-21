### REST API для сайта “Доска объявлений”

There is the "Ads-app" installation process which assumes you have a root access to your server.

#### This repository was checked with the next versions of software

* Node.js v5.12.7
* MySQL Server v5.5
* Npm of any version

#### Dependencies install

``` npm i -g gulp forever```

```
$ git clone https://github.com/neverminderer1/ads-app.git
$ cd ads-app
$ npm i
```

#### Database prepare

Note, DB config's path is `server/config/config.json`. Before running we need to create development (production) database:

```
mysql> CREATE DATABASE `ads_dev` CHARACTER SET utf8 COLLATE utf8_general_ci;
```

Then make migrations:

```
$ cd server
$ sequelize db:migrate
```

#### Run

* Command "gulp" in the project repository starts the server.
* App works on http://localhost:8100.
