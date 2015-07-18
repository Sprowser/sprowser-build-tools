
import Jasmine from 'jasmine'
import Reporter from 'jasmine-terminal-reporter'
import { fileFinder } from './helpers/fileFinder'

let jasmine = new Jasmine()
jasmine.addReporter(new Reporter({
    isVerbose: false,
    showColors: true,
    includeStackTrace: false
}))

export default options => {

    fileFinder(options)
        .filter(fileName => /\.spec\.js$/.test(fileName))
        .flatMap(fileName => {
            jasmine.addSpecFile(fileName)
            return []
        })
        .subscribe(
            () => { },
            err => console.log('Error: ', err),
            () => {
                console.log("finished.")
                try {
                    jasmine.execute()
                } catch (err) {
                    console.log('Error: ', err)
                }
            }
        )
}
