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
```
