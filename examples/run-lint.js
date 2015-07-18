
import { lintRunner } from '../src/index'

lintRunner({
    source: [
        '.',
        './tests'
    ],
    base: __dirname
})
