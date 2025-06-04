<?php namespace Yippy\Flarum\Auth\LDAP;

use Flarum\Extend;
use Flarum\Frontend\Document;

return [
  (new Extend\Frontend('admin'))
    ->content(function (Document $document) {
      $document->head[] = '
        <script src="/assets/extensions/yippy-auth-ldap/jquery.min.js"></script>
        <script src="/assets/extensions/yippy-auth-ldap/select2.min.js"></script>
        <link href="/assets/extensions/yippy-auth-ldap/select2.min.css" rel="stylesheet">
      ';
    }),
  (new Extend\Locales(__DIR__ . '/locale')),
  (new Extend\Frontend('admin'))
    ->js(__DIR__.'/js/dist/admin.js'),
  (new Extend\Frontend('forum'))
    ->js(__DIR__.'/js/dist/forum.js')
    ->css(__DIR__.'/less/forum.less'),
  (new Extend\Routes('forum'))
    ->post('/auth/ldap', 'auth.ldap.post', Controllers\LDAPAuthController::class)
    ->get('/auth/ldap', 'auth.ldap.get', Controllers\LDAPAuthController::class)
    ->post('/register/ldap', 'register.ldap.post', Controllers\LDAPRegisterController::class),
  (new Extend\Settings)
    ->serializeToForum('yippy-auth-ldap.onlyUse', 'yippy-auth-ldap.onlyUse', 'boolVal', false)
    ->serializeToForum('yippy-auth-ldap.display_detailed_error', 'yippy-auth-ldap.display_detailed_error', 'boolVal', false)
    ->serializeToForum('yippy-auth-ldap.method_name', 'yippy-auth-ldap.method_name', 'strVal', 'LDAP'),
];
