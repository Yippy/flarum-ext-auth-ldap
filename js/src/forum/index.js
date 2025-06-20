import { extend, override } from 'flarum/common/extend';
import app from 'flarum/common/app';

import HeaderSecondary from "flarum/components/HeaderSecondary";
import SettingsPage from "flarum/components/SettingsPage";
import Button from 'flarum/components/Button';

import LogInModal from "flarum/components/LogInModal";
import SignUpModal from "flarum/components/SignUpModal";
import LDAPLogInModal from "./components/LDAPLogInModal";
import extractText from 'flarum/utils/extractText';
import Group from 'flarum/common/models/Group';
import textContrastClass from 'flarum/common/helpers/textContrastClass';
import Stream from 'flarum/utils/Stream';

const translationPrefix = 'yippy-auth-ldap.forum.';

app.initializers.add('yippy-auth-ldap', () => {
  extend(HeaderSecondary.prototype, 'items', addLoginLink);
  extend(HeaderSecondary.prototype, 'items', removeIfOnlyUse);
  extend(LogInModal.prototype, 'content', overrideLogInModal);

  extend(SignUpModal.prototype, 'fields', function (items) {
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
      /*
       * Display LDAP Permission Groups
       */
      this.attrs.assignLDAPPermissionGroupList = [];
      if (this.attrs.permissionGroupForLDAP && Array.isArray(this.attrs.permissionGroupForLDAP) && this.attrs.permissionGroupForLDAP.length > 0) {
        // Get all available permission groups
        let permissionGroupList = app.store.all('groups').filter((group) => {
          if (group.id() === Group.MEMBER_ID || group.id() === Group.GUEST_ID) {
            // Do not suggest "virtual" groups
            return false;
          } else {
            return true;
          }
        });

        let assignLDAPPermissionGroupList = [];
        permissionGroupList.forEach((permissionGroup) => {
          let modelPermissionGroup = {
            id: permissionGroup.data.id,
            text: permissionGroup.data.attributes.namePlural,
            icon: permissionGroup.data.attributes.icon,
            color: permissionGroup.data.attributes.color,
            isHidden: permissionGroup.data.attributes.isHidden,
            namePlural: permissionGroup.data.attributes.namePlural,
            nameSingular: permissionGroup.data.attributes.nameSingular,
            selected: true
          };
        if (this.attrs.permissionGroupForLDAP.includes(modelPermissionGroup.id)) {
            assignLDAPPermissionGroupList.push(modelPermissionGroup);
        }
        })
        if (assignLDAPPermissionGroupList.length > 0) {
          this.attrs.assignLDAPPermissionGroupList = assignLDAPPermissionGroupList;
          items.add('permissionGroups', <div className="Form-group">
          Roles
            <select className="FormControl "
              name="LDAPSelectDropdown">
            </select>
          </div>, 19);
        }
      }

      if (app.forum.attribute('displayNameDriver') === 'nickname') {
        const nicknameLabel = extractText(app.translator.trans('flarum-nicknames.forum.sign_up.nickname_placeholder'));

        items.add(
        'nicknameLabel',
        <div className="Form-group">
          {nicknameLabel}
        </div>,
        26
        );
        if (this.isProvided('nickname')) {
          this.nickname = Stream(this.attrs.nickname || '');

          items.add(
            'nickname',
            <div className="Form-group">
              <input
                className="FormControl"
                name="nickname"
                type="text"
                placeholder={extractText(app.translator.trans('flarum-nicknames.forum.sign_up.nickname_placeholder'))}
                bidi={this.nickname}
                disabled={this.loading || this.isProvided('nickname')}
                required={app.forum.attribute('randomizeUsernameOnRegistration')}
              />
            </div>,
            25
          );
        }
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

  extend(SignUpModal.prototype, 'onready', function () {
    if (this.attrs.assignLDAPPermissionGroupList.length > 0) {
      this.$('[name=LDAPSelectDropdown]').select2({
        dropdownCssClass: ":all:",
        disabled: true,
          templateSelection: (value) => {
            var output = '<span style="margin-left: -18px; padding: 5px 10px 5px 10px; background-color:'+value.color+';" class="'+textContrastClass(value.color)+'">'
            if(value.icon){
              output += '<i class="fa fa-lg '+value.icon.toLowerCase()+'"></i> ';
            }
            output += value.text+"</span>";
            return output;
          },
          escapeMarkup: (m) => {
            return m;
          },
          width: '100%',
          multiple: true,
          data: this.attrs.assignLDAPPermissionGroupList
      });
    }
  });

  SignUpModal.prototype.title = function() {
    if (this.attrs.isLDAP) {
      return app.translator.trans(translationPrefix + 'account_found', {server: app.forum.attribute('yippy-auth-ldap.method_name')});
    } else {
      return app.translator.trans('core.forum.sign_up.title');
    }
  }

  SignUpModal.prototype.footer = function() {
    if (this.attrs.isLDAP) {
      return [
      ];
    } else {
      return [
        <p className="SignUpModal-logIn">{app.translator.trans('core.forum.sign_up.log_in_text', { a: <a onclick={this.logIn.bind(this)} /> })}</p>,
      ];
    }
  }

  override(SignUpModal.prototype, 'onsubmit', function (original, e) {
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

  extend(SettingsPage.prototype, 'accountItems', removeProfileActions);
  extend(SettingsPage.prototype, 'settingsItems', checkRemoveAccountSection);

    function overrideLogInModal() {
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
    }

    function addLoginLink(items) {
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
    }

    function removeIfOnlyUse(items) {
        if (app.forum.attribute('yippy-auth-ldap.onlyUse')) {
            if (items.has('signUp')) {
                items.remove('signUp');
            }
            if (items.has('logIn')) {
                items.remove('logIn');
            }
        }
    }

    function removeProfileActions(items) {
        items.remove('changeEmail');
        items.remove('changePassword');
    }

    function checkRemoveAccountSection(items) {
        if (items.has('account') && items.get('account').children.length === 0) {
            items.remove('account');
        }
    }
});
