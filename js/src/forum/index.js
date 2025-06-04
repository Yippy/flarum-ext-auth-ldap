import { extend, override } from 'flarum/common/extend';

import app from 'flarum/forum/app';
import HeaderSecondary from "flarum/forum/components/HeaderSecondary";
import Button from 'flarum/common/components/Button';
import extractText from 'flarum/common/utils/extractText';

import LDAPLogInModal from "./components/LDAPLogInModal";

const translationPrefix = 'yippy-auth-ldap.forum.';

app.initializers.add('yippy-auth-ldap', () => {
  extend(HeaderSecondary.prototype, 'items', function (items) {
	if (items.has('logIn')) {
	  items.add('logInLDAP',
		Button.component(
		  {
			className: 'Button Button--link',
			onclick: () => app.modal.show(LDAPLogInModal)
		  },
		  app.translator.trans(translationPrefix + 'log_in_with', {server: app.forum.attribute('yippy-auth-ldap.method_name')})
		),
		0
	  );
	}
  });

  extend(HeaderSecondary.prototype, 'items', function (items) {
	if (app.forum.attribute('yippy-auth-ldap.onlyUse')) {
	  if (items.has('signUp')) {
		items.remove('signUp');
	  }
	  if (items.has('logIn')) {
		items.remove('logIn');
	  }
	}
  });

  extend("flarum/forum/components/LogInModal", 'oninit', function () {
	if (app.forum.attribute('yippy-auth-ldap.onlyUse')) {
	  LogInModal.prototype.content = LDAPLogInModal.prototype.content
	  LogInModal.prototype.title = LDAPLogInModal.prototype.title
	  LogInModal.prototype.body = LDAPLogInModal.prototype.body
	  LogInModal.prototype.fields = LDAPLogInModal.prototype.fields
	  LogInModal.prototype.footer = LDAPLogInModal.prototype.footer
	  LogInModal.prototype.onerror = LDAPLogInModal.prototype.onerror
	  LogInModal.prototype.onready = LDAPLogInModal.prototype.onready
	  LogInModal.prototype.onsubmit = LDAPLogInModal.prototype.onsubmit
	}
  });

  extend('flarum/forum/components/SignUpModal', 'oninit', function () {
	this.title = function() {
	  if (this.attrs.isLDAP) {
		return app.translator.trans(translationPrefix + 'account_found', {server: app.forum.attribute('yippy-auth-ldap.method_name')});
	  } else {
		return app.translator.trans('core.forum.sign_up.title');
	  }
	}
	this.footer = function() {
	  if (this.attrs.isLDAP) {
		return [];
	  } else {
		return [
		  <p className="SignUpModal-logIn">
			{app.translator.trans('core.forum.sign_up.log_in_text', {
			  a: <Button className="Button Button--text Button--link" onclick={this.logIn.bind(this)} />,
			})}
		  </p>,
		];
	  }
	}
  });

  extend('flarum/forum/components/SignUpModal', 'fields', function (items) {
	if (this.attrs.isLDAP) {
		/*
		 * Provide field labels to avoid confusion, because the default SignUpModal rely on placeholders.
		 * The textfield is already populated, it can look confusing seeing Username and Nickname.
		 */

		const usernameLabel = extractText(app.translator.trans('core.forum.sign_up.username_placeholder'));
		const emailLabel = extractText(app.translator.trans('core.forum.sign_up.email_placeholder'));
		const passwordLabel = extractText(app.translator.trans('core.forum.sign_up.password_placeholder'));

		if (items.has('username')) {
			items.add(
				'usernameLabel',
				<div className="Form-group">
					{usernameLabel}
				</div>,
				31
			);
		}

		if (app.forum.attribute('displayNameDriver') === 'nickname' && this.isProvided('nickname')) {
			const nicknameLabel = extractText(app.translator.trans('flarum-nicknames.forum.sign_up.nickname_placeholder'));

			items.add(
			'nicknameLabel',
			<div className="Form-group">
				{nicknameLabel}
			</div>,
			26
			);
		}

		if (items.has('email')) {
			items.add(
			'emailLabel',
			<div className="Form-group">
				{emailLabel}
			</div>,
			21
			);
		}
	}
  });
  
  override('flarum/forum/components/SignUpModal', 'onsubmit', function (original, e) {
	e.preventDefault();
    this.loading = true;

    const body = this.submitData();

	if (this.attrs.isLDAP) {
		app
		.request({
			url: app.forum.attribute('baseUrl') + '/register/ldap',
			method: 'POST',
			body,
			errorHandler: this.onerror.bind(this),
		})
		.then(() => window.location.reload(), this.loaded.bind(this));
	} else {
		app
		  .request({
			url: app.forum.attribute('baseUrl') + '/register',
			method: 'POST',
			body,
			errorHandler: this.onerror.bind(this),
		  })
		  .then(() => window.location.reload(), this.loaded.bind(this));
	}
  });

  extend('flarum/forum/components/SettingsPage', 'accountItems', function (items) {
	items.remove('changeEmail');
	items.remove('changePassword');
  });
  extend('flarum/forum/components/SettingsPage', 'settingsItems', function (items) {
	if (items.has('account') && items.get('account').children.length === 0) {
	  items.remove('account');
	}
  });
});