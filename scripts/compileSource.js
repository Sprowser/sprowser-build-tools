
import { fileFinder } from '../src/helpers'
import Rx from 'rx'
import path from 'path'
import fs from 'fs'

// Not sure why "import babel from 'babel'" returns a null value.
let babel = require('babel')

let readFile = Rx.Observable.fromNodeCallback(fs.readFile)
let writeFile = Rx.Observable.fromNodeCallback(fs.writeFile)

let options = {
    source: [
        'src'
    ],
    base: path.join(__dirname, '..')
}

fs.mkdir(options.base + "/dist", function() {

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
                fileName: js.fileName.replace("/src/", "/dist/"),
                contents: compiled.code
            }
        })
        .flatMap(js => {
            return writeFile(js.fileName, js.contents, { encoding: 'utf8', flag: 'w' })
        })
        .subscribe(
            () => {},
            (err) => console.log("Error:", err),
            () => console.log("Built ES5 files into dist path.")
        )

})
