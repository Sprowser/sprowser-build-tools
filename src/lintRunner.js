
import { fileFinder } from './helpers/fileFinder'
import fs from 'fs'
import chalk from 'chalk'
import Rx from 'rx'
import {linter as eslint, CLIEngine} from 'eslint'

let readFile = Rx.Observable.fromNodeCallback(fs.readFile)

let eslintOptions = {}
let linter = new CLIEngine(eslintOptions)

export default options => {

    let lintStats = {
        totalFileCount: 0,
        errorFileCount: 0,
        warnCount: 0,
        errorCount: 0
    }

    fileFinder(options)
        .filter(fileName => /\.js$/.test(fileName))
        .flatMap(fileName => {
            return readFile(fileName, { encoding: 'utf8' })
                .map(fileContents => ({
                    fileName: fileName,
                    contents: fileContents
                }))
        })
        .map(lintFile => {
            let config = linter.getConfigForFile(lintFile.fileName)
            let messages = eslint.verify(lintFile.contents, config, lintFile.fileName)
            return {
                fileName: lintFile.fileName,
                messages: messages
            }
        })
        .subscribe(processLintFile, processLintError, processCompletion)

    function processLintFile(result) {
        lintStats.totalFileCount += 1
        if(result.messages && result.messages.length) {
            lintStats.errorFileCount += 1
            console.log(chalk.magenta(result.fileName))
            result.messages.forEach(m => {
                console.log("  %d:%d " + chalk.red("[%s]") + " %s", m.line, m.column, m.ruleId, m.message)
                if(m.severity === 2) {
                    lintStats.errorCount += 1
                }
                else if(m.severity === 1) {
                    lintStats.warnCount += 1
                }
            })
        }
    }

    function processLintError(err) {
        console.log('Error: ', err)
    }

    function processCompletion() {
        console.log("%d of %d files had issues (%d errors, %d warnings)",
            lintStats.errorFileCount,
            lintStats.totalFileCount,
            lintStats.errorCount,
            lintStats.warnCount)
    }
}
