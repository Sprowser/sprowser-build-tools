
import { compileSource } from '../src/index'
import path from 'path'

compileSource({
    source: [
        'src',
        'src/helpers'
    ],
    base: path.join(__dirname, '..')
})
