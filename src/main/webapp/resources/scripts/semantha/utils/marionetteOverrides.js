/**
 * @Author  <mailto:smyrick@expedia.com>Shane Myrick</mailto>
 */

/**
 * Override the Marionette compileTemplate
 * @param  {HTML} rawTemplate Raw html template with HBS templating, i.e. {{ itemName }}
 * @return {HTML}             Returns rendered html with data filled in
 */
Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
  return Handlebars.compile(rawTemplate);
}