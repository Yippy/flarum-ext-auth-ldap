(()=>{var t={n:o=>{var e=o&&o.__esModule?()=>o.default:()=>o;return t.d(e,{a:e}),e},d:(o,e)=>{for(var r in e)t.o(e,r)&&!t.o(o,r)&&Object.defineProperty(o,r,{enumerable:!0,get:e[r]})},o:(t,o)=>Object.prototype.hasOwnProperty.call(t,o),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},o={};(()=>{"use strict";t.r(o);const e=flarum.core.compat["common/extend"],r=flarum.core.compat["common/app"];var n=t.n(r);const a=flarum.core.compat["components/HeaderSecondary"];var i=t.n(a);const s=flarum.core.compat["components/SettingsPage"];var c=t.n(s);const p=flarum.core.compat["components/Button"];var d=t.n(p);const l=flarum.core.compat["components/LogInModal"];var u=t.n(l);const f=flarum.core.compat["components/SignUpModal"];var h=t.n(f);function y(){return y=Object.assign||function(t){for(var o=1;o<arguments.length;o++){var e=arguments[o];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t},y.apply(this,arguments)}function _(t,o){return _=Object.setPrototypeOf||function(t,o){return t.__proto__=o,t},_(t,o)}flarum.core.compat.extend;const b=flarum.core.compat.app;var g=t.n(b);const v=flarum.core.compat["components/Modal"];var x=t.n(v);flarum.core.compat["components/LogInButtons"];const k=flarum.core.compat["utils/extractText"];var w=t.n(k);const N=flarum.core.compat["utils/ItemList"];var O=t.n(N);const P=flarum.core.compat["utils/Stream"];var I=t.n(P),S="yippy-auth-ldap.forum.errors.",M=function(t){var o,e;function r(){return t.apply(this,arguments)||this}e=t,(o=r).prototype=Object.create(e.prototype),o.prototype.constructor=o,_(o,e);var n=r.prototype;return n.oninit=function(o){t.prototype.oninit.call(this,o),this.identification=I()(this.attrs.identification||""),this.password=I()(this.attrs.password||""),this.remember=I()(!!this.attrs.remember)},n.className=function(){return"LogInModal Modal--small"},n.title=function(){return g().translator.trans("yippy-auth-ldap.forum.log_in_with",{server:g().forum.attribute("yippy-auth-ldap.method_name")})},n.content=function(){return[m("div",{className:"Modal-body"},this.body()),m("div",{className:"Modal-footer"},this.footer())]},n.body=function(){return[m("div",{className:"Form Form--centered"},this.fields().toArray())]},n.fields=function(){var t=new(O()),o=g().translator.trans("core.forum.log_in.username_or_email_placeholder"),e=g().translator.trans("core.forum.log_in.password_placeholder");return t.add("identification",m("div",{className:"Form-group"},o,m("input",{className:"FormControl",name:"identification",type:"text",placeholder:o,bidi:this.identification,disabled:this.attrs.loading})),30),t.add("password",m("div",{className:"Form-group"},e,m("input",{className:"FormControl",name:"password",type:"password",placeholder:e,bidi:this.password,disabled:this.attrs.loading})),20),t.add("submit",m("div",{className:"Form-group"},d().component({className:"Button Button--primary Button--block",name:"submit_log_in",type:"submit",loading:this.attrs.loading},g().translator.trans("core.forum.log_in.submit_button"))),-10),t},n.footer=function(){return[]},n.onready=function(){this.$("[name="+(this.identification()?"password":"identification")+"]").select()},n.login=function(t,o){return void 0===o&&(o={}),g().request(y({method:"POST",url:g().forum.attribute("baseUrl")+"/auth/ldap",body:t},o))},n.onsubmit=function(t){t.preventDefault(),this.loading=!0,$('input[name="identification"]').prop("disabled",!0),$('input[name="password"]').prop("disabled",!0),$('button[name="submit_log_in"]').prop("disabled",!0);var o={identification:this.identification(),password:this.password(),remember:this.remember(),csrfToken:g().session.csrfToken},e={errorHandler:this.onerror.bind(this),modifyText:this.modifyResponse.bind(this)};this.login(o,e).catch((function(){}))},n.modifyResponse=function(t){if($('input[name="identification"]').prop("disabled",!1),$('input[name="password"]').prop("disabled",!1),$('button[name="submit_log_in"]').prop("disabled",!1),t.indexOf("app.authenticationComplete")>=0){t.replace(/(^.*\{|\}.*$)/g,"");var o=t.match(/[^{\}]+(?=})/g);o.length>0&&g().authenticationComplete(JSON.parse("{"+o[0]+"}"))}else t.indexOf(g().translator.trans(S+"core_csrf_token_mismatch"))>=0&&this.onerror({alert:{content:g().translator.trans(S+"csrf_token_mismatch"),controls:!1,dismissible:!1,type:"error"},status:400,response:{errors:[{code:"csrf_token_mismatch",status:400}]}});return this.loaded(),t},n.onerror=function(o){var e=null;if(o.response.errors&&o.response.errors.length>0&&(e=o.response.errors[0].code),401===o.status)switch(e){case"search_filter_is_invalid":case"not_authenticated":case"account.not_found":case"account.disabled":case"account.expired":case"account.locked":o.alert.content=g().translator.trans(S+e,{server:g().forum.attribute("yippy-auth-ldap.method_name")});break;case"account.invalid_inputs":case"account.incorrect_details":case"account.password_expired":case"domains.no_domains":o.alert.content=g().translator.trans(S+e);break;case"domains.empty_host":case"domains.empty_base_dn":o.alert.content=g().translator.trans(S+e,{domain_index:o.response.errors[0].domain_index});break;case"domains.empty_user_username":case"domains.empty_search_field":o.alert.content=g().translator.trans(S+e,{server:g().forum.attribute("yippy-auth-ldap.method_name"),domain_index:o.response.errors[0].domain_index});break;case"domains.username_field_does_not_exist":case"domains.mail_field_does_not_exist":o.alert.content=g().translator.trans(S+e,{server:g().forum.attribute("yippy-auth-ldap.method_name"),data:o.response.errors[0].data,domain_index:o.response.errors[0].domain_index})}t.prototype.onerror.call(this,o)},r}(x());n().initializers.add("yippy-auth-ldap",(function(){(0,e.extend)(i().prototype,"items",(function(t){t.has("logIn")&&t.add("logInLDAP",d().component({className:"Button Button--link",onclick:function(){return n().modal.show(M)}},n().translator.trans("yippy-auth-ldap.forum.log_in_with",{server:n().forum.attribute("yippy-auth-ldap.method_name")})),0)})),(0,e.extend)(i().prototype,"items",(function(t){n().forum.attribute("yippy-auth-ldap.onlyUse")&&(t.has("signUp")&&t.remove("signUp"),t.has("logIn")&&t.remove("logIn"))})),(0,e.extend)(u().prototype,"content",(function(){n().forum.attribute("yippy-auth-ldap.onlyUse")&&(u().prototype.content=M.prototype.content,u().prototype.title=M.prototype.title,u().prototype.body=M.prototype.body,u().prototype.fields=M.prototype.fields,u().prototype.footer=M.prototype.footer,u().prototype.onerror=M.prototype.onerror,u().prototype.onready=M.prototype.onready,u().prototype.onsubmit=M.prototype.onsubmit)})),(0,e.extend)(h().prototype,"fields",(function(t){"nickname"===n().forum.attribute("displayNameDriver")&&this.isProvided("nickname")&&(this.nickname=I()(this.attrs.nickname||""),t.add("nickname",m("div",{className:"Form-group"},m("input",{className:"FormControl",name:"nickname",type:"text",placeholder:w()(n().translator.trans("flarum-nicknames.forum.sign_up.nickname_placeholder")),bidi:this.nickname,disabled:this.loading||this.isProvided("nickname"),required:n().forum.attribute("randomizeUsernameOnRegistration")})),25))})),h().prototype.title=function(){return this.attrs.isLDAP?n().translator.trans("yippy-auth-ldap.forum.account_found",{server:n().forum.attribute("yippy-auth-ldap.method_name")}):n().translator.trans("core.forum.sign_up.title")},h().prototype.footer=function(){return this.attrs.isLDAP?[]:[m("p",{className:"SignUpModal-logIn"},n().translator.trans("core.forum.sign_up.log_in_text",{a:m("a",{onclick:this.logIn.bind(this)})}))]},(0,e.extend)(c().prototype,"accountItems",(function(t){t.remove("changeEmail"),t.remove("changePassword")})),(0,e.extend)(c().prototype,"settingsItems",(function(t){t.has("account")&&0===t.get("account").children.length&&t.remove("account")}))}))})(),module.exports=o})();
//# sourceMappingURL=forum.js.map