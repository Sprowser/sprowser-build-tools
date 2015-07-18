
import _ from 'lodash'

export function normalizeFileOptions(options) {

    if(!_.isObject(options)) {
        throw new Error("Invalid file options object.")
    }

    if(!options.base) {
        throw new Error("No base path specified in file options.")
    }

    let sourceFiles
    if(_.isString(options.source)) {
        sourceFiles = [options.source]
    }
    else if(_.isArray(options.source)) {
        sourceFiles = options.source
    }
    else {
        throw new Error("No source files specified in file options.")
    }

    return _.defaults({
        source: sourceFiles
    }, options)
}
