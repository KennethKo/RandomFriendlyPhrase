
import {objects, predicates, teams, collections} from 'friendly-words'
import * as gen from 'random-seed'

const friendlyWords: {[key: string]: string[]} = { objects, predicates, teams, collections }
const rand = gen.create()
const rands: {[key: string]: any} = {}

const getPicker = (code: number | undefined, seed: string | undefined) => {
    let picker: {range: (range: number) => number} = rand
    let curCode = code && code % 1 || 0
    if (code != null) {
        picker = {
            range: (range: number) => {
                // select using the code, and use the remainder for the next range call
                const ret = Math.floor(range * curCode)
                // this remainder allows us to use a single float to represent a unique phrase in NxMx... space
                curCode = range * curCode - ret
                return ret
            }
        }
    } else if (code == null && seed != null) {
        if (rands[seed] != null) {
            picker = rands[seed]
        } else {
            if (Object.keys(rands).length >= 10)
                throw Error(`IllegalStateError: cannot generate for seed ${seed} when 10 other seeds have already been initialized`)
            picker = rands[seed] = gen.create(seed)
        }
    }
    return picker
}

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

/**
 * Returns randomized, human-readable, worksafe phrase. e.g. 'TremendousSpangleFreezer' 
 * 
 * Useful for temporary user names or transient room names.
 * All options below are optional with good defaults.
 * 
 * @param {string[]} [opts.form = ['predicate', 'predicate', 'object']] An array of keys describing the form of the desired phrase. 
 *  Keys must be selected from the following word group keys with the following cardinalities:
 *   predicate - 1454
 *   object - 3072
 *   team - 130
 *   collection - 70
 *  These word groups are locked to v1.2.0 of friendly-words, so the possibility space should be stable.
 *  Illegal keys are ignored.
 *  The default form (['predicate', 'predicate', 'object']) has a possibility space of roughly 10bn.
 * @param {string} [opts.delimeter = ''] The delimeter between each word in the phrase. Default empty string.
 * @param {string} [opts.prefix = undefined] If defined, constrains the space of the first word in the phrase. 
 *   Case insensitive.
 * @param {number} [ops.code = undefined] If defined, a number between 0 and 1 (1 excluded) that dictates a stable phrase.
 *   That is, the same phrase will be generated when given the same number. 
 *   This should be stable across versions, as we're locked to v1.2.0 of friendly-words.
 *   Any number >= 1 will be moduloed against 1 to take just the fractional part.
 *   This can map identifiers to stable friendly phrases.
 * @param {string} [ops.seed = undefined] If defined, defines a stable seed for producing an identical series of 
 *   random phrases from initialization. 
 *   Call this function repeatedly with the same seed to make it behave like a generator along the same sequence.
 *   Intended for stable unit testing or for stable internal startup. 
 *   This should be stable across versions, as we're locked to v1.2.0 of friendly-words.
 *   Not intended for general use. Throws if more than 10 different seeds are ever requested.
 *   Ignored if ops.code is defined.
 */
function randomFriendlyPhrase({
    // named parameter defaults
    form = ['predicate', 'predicate', 'object'],
    delimeter = '',
    prefix,
    code,
    seed,
} : {
    // types
    form?: string[],
    delimeter?: string,
    prefix?: string,
    code?: number,
    seed?: string,
} = {}) {
    const form2 = form.map(k => k+'s').filter(k => !!friendlyWords[k])
    if (!form2.length) throw Error(`InvalidArgumentError: illegal form [${form}]`)

    const picker = getPicker(code, seed)

    return form2.map((k, i) => {
        let space = friendlyWords[k]
        if (i === 0 && prefix) {
            const lowPrefix = prefix.toLowerCase()
            space = friendlyWords[k].filter((w:string) => w.startsWith(lowPrefix))
            if (!space.length) 
                throw Error(`InvalidArgumentError: could not find prefix '${prefix}' in word group '${k.substring(0, k.length-1)}'`)
        }
        return space[picker.range(space.length)]
    })
    .map(capitalize)
    .join(delimeter)
}

export default randomFriendlyPhrase

