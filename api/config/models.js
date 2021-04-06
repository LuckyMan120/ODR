/**
 * Default model settings
 * (sails.config.models)
 *
 * Your default, project-wide model settings. Can also be overridden on a
 * per-model basis by setting a top-level properties in the model definition.
 *
 * For details about all available model settings, see:
 * https://sailsjs.com/config/models
 *
 * For more general background on Sails model settings, and how to configure
 * them on a project-wide or per-model basis, see:
 * https://sailsjs.com/docs/concepts/models-and-orm/model-settings
 */

module.exports.models = {

  // schema: true,

  /***************************************************************************
  *                                                                          *
  * How and whether Sails will attempt to automatically rebuild the          *
  * tables/collections/etc. in your schema.                                  *
  *                                                                          *
  * > Note that, when running in a production environment, this will be      *
  * > automatically set to `migrate: 'safe'`, no matter what you configure   *
  * > here.  This is a failsafe to prevent Sails from accidentally running   *
  * > auto-migrations on your production database.                           *
  * >                                                                        *
  * > For more info, see:                                                    *
  * > https://sailsjs.com/docs/concepts/orm/model-settings#?migrate          *
  *                                                                          *
  ***************************************************************************/

  migrate: 'alter',

  /***************************************************************************
  *                                                                          *
  * Base attributes that are included in all of your models by default.      *
  * By convention, this is your primary key attribute (`id`), as well as two *
  * other timestamp attributes for tracking when records were last created   *
  * or updated.                                                              *
  *                                                                          *
  * > For more info, see:                                                    *
  * > https://sailsjs.com/docs/concepts/orm/model-settings#?attributes       *
  *                                                                          *
  ***************************************************************************/

  attributes: {
    createdAt: {type: 'number', autoCreatedAt: true},
    updatedAt: {type: 'number', autoUpdatedAt: true},
    id: {type: 'number', autoIncrement: true}
    //--------------------------------------------------------------------------
    //  /\   Using MongoDB?
    //  ||   Replace `id` above with this instead:
    //
    // ```
    // id: { type: 'string', columnName: '_id' },
    // ```
    //
    // Plus, don't forget to configure MongoDB as your default datastore:
    // https://sailsjs.com/docs/tutorials/using-mongo-db
    //--------------------------------------------------------------------------
  },

  dataEncryptionKeys: {
    default: 'MpM8wt0bkcIuytrdngxBgl1+YYwSgsFpNhPDeDuVwIY='
  },

  /***************************************************************************
  *                                                                          *
  * Whether or not implicit records for associations should be cleaned up    *
  * automatically using the built-in polyfill.  This is especially useful    *
  * during development with sails-disk.                                      *
  *                                                                          *
  * Depending on which databases you're using, you may want to disable this  *
  * polyfill in your production environment.                                 *
  *                                                                          *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  cascadeOnDestroy: true

};
