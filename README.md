# Flarum LDAP authentication

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Yippy/flarum-ext-auth-ldap/blob/master/LICENSE) [![Latest Stable Version](https://img.shields.io/packagist/v/yippy/flarum-ext-auth-ldap.svg)](https://packagist.org/packages/yippy/flarum-ext-auth-ldap) [![Total Downloads](https://img.shields.io/packagist/dt/yippy/flarum-ext-auth-ldap.svg)](https://packagist.org/packages/yippy/flarum-ext-auth-ldap) [![Donate](https://img.shields.io/badge/-Buy%20Me%20a%20Coffee-ff5f5f?logo=ko-fi&logoColor=white)](https://www.buymeacoffee.com/yippy)

Based on [tituspijean/flarum-ext-auth-ldap](https://github.com/tituspijean/flarum-ext-auth-ldap)

This extension enables users to log into [Flarum](https://github.com/flarum/core) through LDAP, there has been new improvement with this fork. With multiple LDAP server support, and optional email field.

## How to install

`composer require yippy/flarum-ext-auth-ldap`

Must install select2 assets for LDAP Server Settings dropdown selection to work.

`php flarum assets:publish`

Activate it in Flarum's administration panel.

## Languages

This extension support English.

## Configuration

![Screenshot](/assets/images/ldap_login_settings.png)

- `LDAP server name`: sets the end of the `Login with` link at the top of the forum: ![image](https://user-images.githubusercontent.com/8769166/82216921-eeed9080-9919-11ea-9ae5-8c795816f3fa.png)

- `LDAP domains or server IP adresses (comma separated)`: list of LDAP servers to use.
- `Port`: LDAP server port
- `LDAP Version`: LDAP server version
- `Base DNs (semicolon separated)`: list of base DNs to search users in.
- `Filter to apply (optional)`: Additional filtering, for example require users to be in a specific group.
- `Follow referrals`, `Use SSL`, `Use TLS`: LDAP server settings
- `LDAP admin distinguished name` and `LDAP admin password (leave empty for anonymous binding)` : if needed, specific the DN and password of the user allowed to perform searches in the LDAP server.
- `LDAP user search fields (comma separated)`: list of the LDAP fields used to look for the users. The extension will try all combinations of base DNs and search fields.
- `LDAP username field`: name of the field containing the username that uniquely identifies the user. Can be `uid` or `sAMAccountname`, for example.
- `LDAP email field (optional)`: name of the field containing the user's email address. The extension will use the first email found for the user's registration in Flarum. 
- `LDAP nickname search fields, enable Nicknames extension (comma separated)`

- `Disable Flarum login and only use LDAP authentication`: merely hides the standard login links and buttons. Users can still use the standard login method through the API.
- `Display detailed LDAP errors for failed login attempts`: enable this option to help troubleshoot LDAP account errors for failed login, this will display a error whether the account isn't found, disabled or password expired.

## Development (With docker)

- Clone the repository
- Copy docker.conf : `cp docker/.docker.conf.dist docker/.docker.conf`
- Change UID in `docker/.docker.conf` if needed.
- Start dockers : `./install.sh install`
- Open http://flarum.localhost
  * MySQL host: mysql
  * MySQL DB: flarum
  * MySQL user: flarum
  * MySQL password: flarum
- Go to Admin panel and enable extension
  * LDAP domain: ldap
  * LDAP DN: dc=flarum,dc=com
  * Check connect with Ldap admin
  * LDAP admin: cn=admin,dc=flarum,dc=com
  * LDAP admin password: flarum
  * LDAP search user fields: cn,mail
  * LDAP user mail: mail
  * LDAP user username: cn
- Add and user on : http://localhost:8081/
  * Login: cn=admin,dc=flarum,dc=com
  * Password: flarum
  * Create a new entry -> Default -> inetOrgPerson
