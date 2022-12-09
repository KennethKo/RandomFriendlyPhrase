# RandomFriendlyPhrase

A utility to generate randomized, human-readable, worksafe phrases in a large space with good defaults. Useful for temporary user names or room names.

```
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
 * @param {number} [ops.seed = undefined] If defined, defines a stable seed for producing an identical series of 
 *   random phrases from initialization. 
 *   Call this function repeatedly with the same seed to make it behave like a generator along the same sequence.
 *   Intended for stable unit testing or for stable internal startup. 
 *   This should be stable across versions, as we're locked to v1.2.0 of friendly-words.
 *   Not intended for general use. Throws if more than 10 different seeds are ever requested.
 *   Ignored if ops.code is defined.
 */
```
