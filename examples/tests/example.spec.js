/*eslint-env jasmine*/

describe('test', () => {
    let x = 123 // Something for lint to find.
    it('should run', () => {
        expect(true).toBe(true)
    })
    it('should fail', () => {
        expect(true).toBe(false)
    })
})
