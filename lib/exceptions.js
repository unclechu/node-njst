/*!
 * nJSt exceptions
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

var list = [];

function base() {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
}

list.push(function IncorrectTemplateCodeType(message) {
    base.call(this);
    this.message = message || 'Incorrect template code type (must be a string).';
});

list.push(function IncorrectTemplateFilenameType(message) {
    base.call(this);
    this.message = message || 'Incorrect template filename type (must be a string).';
});

list.push(function IncorrectTemplateContextType(message) {
    base.call(this);
    this.message = message || 'Incorrect template context type (must be an object or null).';
});

list.push(function TemplateFileIsNotExists(message) {
    base.call(this);
    this.message = message || 'Template file is not exists.';
});

list.push(function ReadTemplateFileError(message) {
    base.call(this);
    this.message = message || 'Reading template file error.';
});

list.push(function ParseTemplateSyntaxError(message) {
    base.call(this);
    this.message = message || 'Parsing template file error.';
});

list.push(function IncorrectTemplateFileExtensions(message) {
    base.call(this);
    this.message = message || 'Incorrect template file extensions list value.';
});

list.push(function UnknownParameterKey(message) {
    base.call(this);
    this.message = message || 'Unknown parameter key.';
});

list.push(function UnknownInitInstrumentsOption(message) {
    base.call(this);
    this.message = message || 'Unknown option for initInstruments function.';
});

list.push(function SystemContextOverwritten(message) {
    base.call(this);
    this.message = message || 'System context was overwritten.';
});

list.forEach(function (val) {
    module.exports[val.name] = val;
});
