
import { fileFinder } from './fileFinder'
import { normalizeFileOptions } from './fileOptions'
import Rx from 'rx'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

// Not sure why "import babel from 'babel'" returns a null value.
let babel = require('babel')

let readFile = Rx.Observable.fromNodeCallback(fs.readFile)
let writeFile = Rx.Observable.fromNodeCallback(fs.writeFile)
let mkdirIgnoreError = Rx.Observable.fromNodeCallback((p, cb) => fs.mkdir(p, () => cb()))

export function compileSource(options) {

    options = normalizeFileOptions(options)

    return Rx.Observable.fromArray(options.source)
        .map(src => {
            return path.join(options.base, src).replace(/([\/\\])src([\/\\]|$)/, "$1dist$2")
        })
        .flatMap(dest => {
            return mkdirIgnoreError(dest)
        })
        .subscribe(
            () => {},
            err => console.log(chalk.red("%s"), err),
            () => {

                fileFinder(options)
                    .filter(fileName => /\.js$/.test(fileName))
                    .flatMap(fileName => {
                        return readFile(fileName, { encoding: 'utf8' })
                            .map(fileContents => ({
                                fileName: fileName,
                                contents: fileContents
                            }))
                    })
                    .map(js => {
                        let compiled = babel.transform(js.contents, {
                            modules: "common"
                        })
                        return {
                            fileName: js.fileName.replace(/([\/\\])src([\/\\])/, "$1dist$2"),
                            contents: compiled.code
                        }
                    })
                    .flatMap(js => {
                        return writeFile(js.fileName, js.contents, { encoding: 'utf8', flag: 'w' })
                    })
                    .subscribe(
                        () => {},
                        err => console.log(chalk.red("%s"), err),
                        () => console.log("Built ES5 files into dist path."))
        })
}
