/*!
 * nJSt exceptions
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

function IncorrectTemplateCodeType(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Incorrect template code type (must be a string).';
}

function IncorrectTemplateFilenameType(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Incorrect template filename type (must be a string).';
}

function IncorrectTemplateContextType(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Incorrect template context type (must be an object or null).';
}

function TemplateFileIsNotExists(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Template file is not exists.';
}

function ReadTemplateFileError(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Reading template file error.';
}

function ParseTemplateSyntaxError(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Parsing template file error.';
}

function IncorrectTemplateFileExtensions(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Incorrect template file extensions list value.';
}

function UnknownParameterKey(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Unknown parameter key.';
}

function UnknownInitInstrumentsOption(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Unknown option for initInstruments function.';
}

function SystemContextOverwritten(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'System context was overwritten.';
}

module.exports = {
    IncorrectTemplateCodeType: IncorrectTemplateCodeType,
    IncorrectTemplateFilenameType: IncorrectTemplateFilenameType,
    IncorrectTemplateContextType: IncorrectTemplateContextType,
    TemplateFileIsNotExists: TemplateFileIsNotExists,
    ReadTemplateFileError: ReadTemplateFileError,
    ParseTemplateSyntaxError: ParseTemplateSyntaxError,
    IncorrectTemplateFileExtensions: IncorrectTemplateFileExtensions,
    UnknownParameterKey: UnknownParameterKey,
    UnknownInitInstrumentsOption: UnknownInitInstrumentsOption,
    SystemContextOverwritten: SystemContextOverwritten
};
