
import { lintRunner } from '../src/index'
import path from 'path'

lintRunner({
    source: [
        'src',
        'src/helpers',
        'scripts'
    ],
    base: path.join(__dirname, '..')
})
