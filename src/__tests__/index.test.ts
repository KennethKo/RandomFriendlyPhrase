import randomFriendlyPhrase from '../index'

test('Jest heartbeat - trivial test', () => {})

const zeroPhrase = 'AbackAbackAardvark'

test('randomFriendlyPhrase happy path', () => {
    expect(randomFriendlyPhrase()).toBeDefined()
    expect(randomFriendlyPhrase({})).toBeDefined()
    expect(randomFriendlyPhrase()).not.toEqual(zeroPhrase)
})

test('randomFriendlyPhrase form', () => {
    expect(randomFriendlyPhrase({
        form: ['object'],
        delimeter: ' ',
    }).split(' ').length).toEqual(1)
    expect(randomFriendlyPhrase({
        form: ['predicate','object','team','collection','predicate','object','team','collection'],
        delimeter: ' ',
    }).split(' ').length).toEqual(8)
    expect(randomFriendlyPhrase({
        form: ['predicate','object','team','collection','foo'],
        delimeter: ',,',
    }).split(',,').length).toEqual(4)
})

test('randomFriendlyPhrase form error', () => {
    expect(() => randomFriendlyPhrase({form: []})).toThrowError(/InvalidArgumentError: illegal form.*/)
    expect(() => randomFriendlyPhrase({form: ['foo', 'bar']})).toThrowError(/InvalidArgumentError: illegal form.*/)
})

test('randomFriendlyPhrase prefix', () => {
    expect(randomFriendlyPhrase({prefix: 'D'})).toMatch(/D.*/)
    expect(randomFriendlyPhrase({prefix: 'qu'})).toMatch(/Qu.*/)
    expect(randomFriendlyPhrase({form: ['object'], prefix: 'Z'})).toMatch(/Z.*/)
    expect(randomFriendlyPhrase({form: ['object'], prefix: 'Z', delimeter: ',,'}).split(',,').length).toEqual(1)
})

test('randomFriendlyPhrase prefix error', () => {
    expect(() => randomFriendlyPhrase({prefix: 'aa'})).toThrowError(/d/)
    expect(randomFriendlyPhrase({prefix: 'aa', form: ['object', 'predicate']})).toMatch(/Aa.*/)
})

const code = 1.2345678901234
test('randomFriendlyPhrase code', () => {
    expect(randomFriendlyPhrase({code: 0})).toMatch(zeroPhrase)
    expect(randomFriendlyPhrase({code})).toMatch(randomFriendlyPhrase({code}))
    expect(randomFriendlyPhrase({code})).toMatch(randomFriendlyPhrase({code: code+1}))
    expect(randomFriendlyPhrase({code})).not.toMatch(randomFriendlyPhrase({code: code+0.1}))
    // terms should never equal except for code zero.
    const [pred1, pred2] = randomFriendlyPhrase({code, form: ['predicate', 'predicate'], delimeter: ','}).split(',')
    expect(pred1).not.toEqual(pred2)
    const [pred3, pred4] = randomFriendlyPhrase({code: 0, form: ['predicate', 'predicate'], delimeter: ','}).split(',')
    expect(pred3).toEqual(pred4)
})

const seed = '0'
test('randomFriendlyPhrase seed', () => {
    expect(randomFriendlyPhrase({seed})).toMatch('CreamAtlanticAragon')
    expect(randomFriendlyPhrase({seed, code: 0})).toMatch(zeroPhrase)
    expect(randomFriendlyPhrase({seed, code})).toMatch('DorianBandRest')
    expect(randomFriendlyPhrase({seed})).toMatch('MirageStreamBrush')
    expect(randomFriendlyPhrase({seed})).toMatch('PyriteSilkenSphere')
    expect(randomFriendlyPhrase({seed: '1'})).toMatch('GlacierTellingFig')
    expect(randomFriendlyPhrase({seed})).toMatch('PalmRhinestoneButterkase')

    const phrases = [
        'CreamAtlanticAragon',
        'GlacierTellingFig',    // seed 0 and 1 are tested above
        'WhimsicalSteadyStygimoloch',
        'RogueLoftyClove',
        'ChippedIncongruousRun',
        'LavenderFierceStick',
        'NonstopMarbledPrince',
        'GlowThankfulLiterature',
        'AliveDaffodilRose',
        'TrickyRingedSled'
    ]
    for (let i=2; i<10; i++) {
        expect(randomFriendlyPhrase({seed: `${i}`})).toEqual(phrases[i])
    }
    expect(() => randomFriendlyPhrase({seed: '10'})).toThrowError(/IllegalStateError: cannot generate for seed 10.*/)
    // seed remains disregarded when code is passed
    expect(randomFriendlyPhrase({seed: '10', code: 0})).toMatch(zeroPhrase)
    expect(() => randomFriendlyPhrase({seed: '10'})).toThrowError(/IllegalStateError: cannot generate for seed 10.*/)
})
