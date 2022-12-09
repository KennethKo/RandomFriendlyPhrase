import { objects, predicates, teams, collections } from 'friendly-words'
import * as gen from 'random-seed'

const friendlyWords: { [key: string]: string[] } = { objects, predicates, teams, collections }

type Opts = {
  // types
  form?: string[]
  delimeter?: string
  prefix?: string
  code?: string
  seed?: string
}

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
 * @param {string} [ops.code = undefined] If defined, a code that should always map to the same stable phrase.
 *   This should be stable across versions, as we're locked to v1.2.0 of friendly-words.
 *   This can map identifiers to stable friendly phrases.
 * @param {string} [ops.seed = undefined] If defined, defines a stable seed for producing an identical series of
 *   random phrases from initialization.
 *   Call this function repeatedly with the same seed to make it behave like a generator along the same sequence.
 *   Intended for stable unit testing or for stable internal startup.
 *   This should be stable across versions, as we're locked to v1.2.0 of friendly-words.
 *   Not intended for general use. Throws if more than 10 different seeds are ever requested.
 *   Ignored if ops.code is defined.
 */
function randomFriendlyPhrase(opts: Opts = {}) {
  // named parameter defaults
  const { form = ['predicate', 'predicate', 'object'], delimeter = '', prefix } = opts
  opts = { form, delimeter, prefix, ...opts }

  const normForm = form.map((k) => k + 's').filter((k) => !!friendlyWords[k])
  if (!normForm.length) throw Error(`InvalidArgumentError: illegal form [${form}]`)

  const picker = getPicker(opts)

  return normForm
    .map((k, i) => {
      let space = friendlyWords[k]
      if (i === 0 && prefix) {
        const lowPrefix = prefix.toLowerCase()
        space = friendlyWords[k].filter((w: string) => w.startsWith(lowPrefix))
        if (!space.length)
          throw Error(
            `InvalidArgumentError: could not find prefix '${prefix}' in word group '${k.substring(0, k.length - 1)}'`,
          )
      }
      return space[picker.range(space.length)]
    })
    .map(capitalize)
    .join(delimeter)
}

// gen.create()'s gen.RandomSeed fulfills the generalized local Picker type
type Picker = { range: (range: number) => number }
const rand = gen.create()
const rands: { [key: string]: Picker } = {}

const getPicker = ({ code, seed }: Opts): Picker => {
  // let code return a stable, unique pick with an avalanche effect
  if (code != null) {
    // picker lifecycle within phrase
    return gen.create(code)
  }
  // let seed return a stable random sequence
  if (seed != null) {
    if (rands[seed] != null) {
      return rands[seed]
    } else {
      if (Object.keys(rands).length >= 10)
        throw Error(
          `IllegalStateError: cannot generate for seed ${seed} when 10 other seeds have already been initialized`,
        )
      // picker lifecycle across phrases. Adding salt to make seed and code differ
      rands[seed] = gen.create(seed + 'Salt')
      return rands[seed]
    }
  }
  // otherwise return an unbiased randomizer
  return rand
}

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

export default randomFriendlyPhrase
