
import { lintRunner } from '../index'

lintRunner({
    source: [
        '.',
        './tests',
        '../src',
        '..'
    ],
    base: __dirname
})
