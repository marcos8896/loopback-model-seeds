'use strict';

/**
 * This module is meant to have all the models functionality of the Loopback models.
 * Functionality that needs to be shared in multiple places.
 * @module Shared/ModelsUtils
 *
 */


/**
 * Return a promises which contains all the Loobpack's custom models with
 * all its properties on it.
 * @param {string} modelsPath - The relative path where the Loopback JSON models
 * are placed - Default is './common/models'
 * @author Marcos Barrera del Río <elyomarcos@gmail.com>
 * @returns {Promise<Array>}
 */
function getModelsContentFromJSONs( modelsPath ) {

  const readfiles = require( 'node-readfiles' );
  let arrayModels = [];

  const callback = ( err, filename, contents ) => {

    if ( err ) throw err;

    let json = {
      filename,
      name: JSON.parse( contents ).name,
      properties_seeds: Object.keys( JSON.parse( contents ).properties ),
    };

    arrayModels.push( json );

  };

  return readfiles( modelsPath, { filter: '*.json' }, callback )
    .then( () => arrayModels )
    .catch( error => console.log( error ) );

}



/**
 * Return a promises which contains all the Loobpack's custom models from the
 * JSON files on the common/models folder with the request properties on it.
 * @author Marcos Barrera del Río <elyomarcos@gmail.com>
 * @param {string[]} requestedProperties - The wanted properties to be return in
 * promise.
 * @returns {Promise<Object[]>} - A promise which contains an array of objects,
 * and each object represents a Loopback model with the requested properties.
 */
function getModelsWithRequestedProperties( requestedProperties, modelsPath = './common/models/' ) {

  const readfiles = require( 'node-readfiles' );
  const arrayModels = [];

  return readfiles(
    modelsPath,
    { filter: '*.json' },
    ( err, filename, model ) => {

      if ( err ) throw err;

      const parsedModel = JSON.parse( model );

      let json = {};

      requestedProperties.forEach( prop => json[prop] = parsedModel[prop] );

      arrayModels.push( json );

    }).then( () => arrayModels )
    .catch( error => console.log( error ) );

}


/**
 * Return a promise which contains only the names from all the Loobpack's custom models.
 * @param {string} modelsPath - The relative path where the Loopback JSON models
 * are placed - Default is './common/models'
 * @author Marcos Barrera del Río <elyomarcos@gmail.com>
 * @returns {Promise<Array>}
 */
async function getNameModelsArray( modelsPath = './common/models/' ) {

  let names = [];

  try {

    names = await getModelsContentFromJSONs( modelsPath )
                    .then( models => models.map( model => model.name ) );

  } catch ( error ) {

    console.log( error );

  }

  return names;

}


module.exports = {
  getModelsContentFromJSONs,
  getNameModelsArray,
  getModelsWithRequestedProperties,
};
