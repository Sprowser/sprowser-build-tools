
import _ from 'lodash'
import fs from 'fs'
import Rx from 'rx'

let readdir = Rx.Observable.fromNodeCallback(fs.readdir)

export function fileFinder(options) {

    if(!_.isObject(options)) {
        throw new Error("Invalid options object.")
    }

    let sourceFiles
    if(_.isString(options.source)) {
        sourceFiles = [options.source]
    }
    else if(_.isArray(options.source)) {
        sourceFiles = options.source
    }
    else {
        throw new Error("No source files specified.")
    }

    options.base = options.base || __dirname

    return Rx.Observable
        .fromArray(sourceFiles.map(path => [options.base, path].join('/')))
        .flatMap(path =>
            readdir(path)
                .flatMap(fileNames =>
                    Rx.Observable
                        .fromArray(fileNames)
                        .map(fileName => [path, fileName].join('/'))))
}
