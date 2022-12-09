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

const code = 'foobar'
const codePhrase = 'SameHeadyPeridot'
test('randomFriendlyPhrase code', () => {
    expect(randomFriendlyPhrase({code})).toMatch(codePhrase)
    expect(randomFriendlyPhrase({code})).toMatch(randomFriendlyPhrase({code}))
    expect(randomFriendlyPhrase({code})).not.toMatch(randomFriendlyPhrase({code: code+'baz'}))
    // terms should never equal
    const [pred1, pred2] = randomFriendlyPhrase({code: code+'baz', form: ['predicate', 'predicate'], delimeter: ','}).split(',')
    expect(pred1).not.toEqual(pred2)
})

const seed = '0'
test('randomFriendlyPhrase seed', () => {
    expect(randomFriendlyPhrase({seed})).toMatch('LapisLikeStretch')
    expect(randomFriendlyPhrase({seed, code})).toMatch(codePhrase)
    expect(randomFriendlyPhrase({seed})).toMatch('TricolorHillTable')
    expect(randomFriendlyPhrase({seed})).toMatch('TenderCapableJonquil')
    expect(randomFriendlyPhrase({seed: '1'})).toMatch('OssifiedDaffyArtichoke')
    expect(randomFriendlyPhrase({seed})).toMatch('OpaqueCubicCreek')

    const phrases = [
        'LapisLikeStretch',
        'OssifiedDaffyArtichoke',    // seed 0 and 1 are tested above
        'PicturesqueEightAmbulance',
        'ScintillatingMulberryList',
        'ThinkableFlutteringPatella',
        'CeruleanThankfulDiploma',
        'SaltySteadfastBillboard',
        'GlamorousRippleOkra',
        'InvitedTorchAddress',
        'SleetPuzzledTangelo',
    ]
    for (let i=2; i<10; i++) {
        expect(randomFriendlyPhrase({seed: `${i}`})).toEqual(phrases[i])
    }
    expect(() => randomFriendlyPhrase({seed: '10'})).toThrowError(/IllegalStateError: cannot generate for seed 10.*/)
    // seed remains disregarded when code is passed
    expect(randomFriendlyPhrase({seed: '10', code})).toMatch(codePhrase)
    expect(() => randomFriendlyPhrase({seed: '10'})).toThrowError(/IllegalStateError: cannot generate for seed 10.*/)
})
