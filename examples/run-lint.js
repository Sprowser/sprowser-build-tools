
import lintRunner from '../src/lintRunner.js'

lintRunner({
    source: [
        '.',
        './tests',
        '../src',
        '..'
    ],
    base: __dirname
})
