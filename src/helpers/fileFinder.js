
import { normalizeFileOptions } from './fileOptions'
import path from 'path'
import fs from 'fs'
import Rx from 'rx'

let readdir = Rx.Observable.fromNodeCallback(fs.readdir)

export function fileFinder(options) {

    options = normalizeFileOptions(options)

    return Rx.Observable.fromArray(options.source)
        .map(filePath => path.join(options.base, filePath))
        .flatMap(filePath =>
            readdir(filePath)
                .flatMap(fileNames =>
                    Rx.Observable.fromArray(fileNames)
                        .map(fileName => path.join(filePath, fileName))))
}
