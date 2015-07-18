
import { lintRunner } from '../src/index'
import path from 'path'

lintRunner({
    source: [
        'src',
        'scripts'
    ],
    base: path.join(__dirname, '..')
})
