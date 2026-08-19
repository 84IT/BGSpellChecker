(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/is-buffer/index.js
  var require_is_buffer = __commonJS({
    "node_modules/is-buffer/index.js"(exports, module) {
      module.exports = function isBuffer(obj) {
        return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
      };
    }
  });

  // node_modules/nspell/lib/util/rule-codes.js
  var require_rule_codes = __commonJS({
    "node_modules/nspell/lib/util/rule-codes.js"(exports, module) {
      "use strict";
      module.exports = ruleCodes;
      var NO_CODES = [];
      function ruleCodes(flags, value) {
        var index = 0;
        var result;
        if (!value) return NO_CODES;
        if (flags.FLAG === "long") {
          result = new Array(Math.ceil(value.length / 2));
          while (index < value.length) {
            result[index / 2] = value.slice(index, index + 2);
            index += 2;
          }
          return result;
        }
        return value.split(flags.FLAG === "num" ? "," : "");
      }
    }
  });

  // node_modules/nspell/lib/util/affix.js
  var require_affix = __commonJS({
    "node_modules/nspell/lib/util/affix.js"(exports, module) {
      "use strict";
      var parse = require_rule_codes();
      module.exports = affix;
      var push = [].push;
      var alphabet = "etaoinshrdlcumwfgypbvkjxqz".split("");
      var whiteSpaceExpression = /\s+/;
      var defaultKeyboardLayout = [
        "qwertzuop",
        "yxcvbnm",
        "qaw",
        "say",
        "wse",
        "dsx",
        "sy",
        "edr",
        "fdc",
        "dx",
        "rft",
        "gfv",
        "fc",
        "tgz",
        "hgb",
        "gv",
        "zhu",
        "jhn",
        "hb",
        "uji",
        "kjm",
        "jn",
        "iko",
        "lkm"
      ];
      function affix(doc) {
        var rules = /* @__PURE__ */ Object.create(null);
        var compoundRuleCodes = /* @__PURE__ */ Object.create(null);
        var flags = /* @__PURE__ */ Object.create(null);
        var replacementTable = [];
        var conversion = { in: [], out: [] };
        var compoundRules = [];
        var aff = doc.toString("utf8");
        var lines = [];
        var last = 0;
        var index = aff.indexOf("\n");
        var parts;
        var line;
        var ruleType;
        var count;
        var remove;
        var add;
        var source;
        var entry;
        var position;
        var rule;
        var value;
        var offset;
        var character;
        flags.KEY = [];
        while (index > -1) {
          pushLine(aff.slice(last, index));
          last = index + 1;
          index = aff.indexOf("\n", last);
        }
        pushLine(aff.slice(last));
        index = -1;
        while (++index < lines.length) {
          line = lines[index];
          parts = line.split(whiteSpaceExpression);
          ruleType = parts[0];
          if (ruleType === "REP") {
            count = index + parseInt(parts[1], 10);
            while (++index <= count) {
              parts = lines[index].split(whiteSpaceExpression);
              replacementTable.push([parts[1], parts[2]]);
            }
            index--;
          } else if (ruleType === "ICONV" || ruleType === "OCONV") {
            count = index + parseInt(parts[1], 10);
            entry = conversion[ruleType === "ICONV" ? "in" : "out"];
            while (++index <= count) {
              parts = lines[index].split(whiteSpaceExpression);
              entry.push([new RegExp(parts[1], "g"), parts[2]]);
            }
            index--;
          } else if (ruleType === "COMPOUNDRULE") {
            count = index + parseInt(parts[1], 10);
            while (++index <= count) {
              rule = lines[index].split(whiteSpaceExpression)[1];
              position = -1;
              compoundRules.push(rule);
              while (++position < rule.length) {
                compoundRuleCodes[rule.charAt(position)] = [];
              }
            }
            index--;
          } else if (ruleType === "PFX" || ruleType === "SFX") {
            count = index + parseInt(parts[3], 10);
            rule = {
              type: ruleType,
              combineable: parts[2] === "Y",
              entries: []
            };
            rules[parts[1]] = rule;
            while (++index <= count) {
              parts = lines[index].split(whiteSpaceExpression);
              remove = parts[2];
              add = parts[3].split("/");
              source = parts[4];
              entry = {
                add: "",
                remove: "",
                match: "",
                continuation: parse(flags, add[1])
              };
              if (add && add[0] !== "0") {
                entry.add = add[0];
              }
              try {
                if (remove !== "0") {
                  entry.remove = ruleType === "SFX" ? end(remove) : remove;
                }
                if (source && source !== ".") {
                  entry.match = ruleType === "SFX" ? end(source) : start(source);
                }
              } catch (_) {
                entry = null;
              }
              if (entry) {
                rule.entries.push(entry);
              }
            }
            index--;
          } else if (ruleType === "TRY") {
            source = parts[1];
            offset = -1;
            value = [];
            while (++offset < source.length) {
              character = source.charAt(offset);
              if (character.toLowerCase() === character) {
                value.push(character);
              }
            }
            offset = -1;
            while (++offset < alphabet.length) {
              if (source.indexOf(alphabet[offset]) < 0) {
                value.push(alphabet[offset]);
              }
            }
            flags[ruleType] = value;
          } else if (ruleType === "KEY") {
            push.apply(flags[ruleType], parts[1].split("|"));
          } else if (ruleType === "COMPOUNDMIN") {
            flags[ruleType] = Number(parts[1]);
          } else if (ruleType === "ONLYINCOMPOUND") {
            flags[ruleType] = parts[1];
            compoundRuleCodes[parts[1]] = [];
          } else if (ruleType === "FLAG" || ruleType === "KEEPCASE" || ruleType === "NOSUGGEST" || ruleType === "WORDCHARS") {
            flags[ruleType] = parts[1];
          } else {
            flags[ruleType] = parts[1];
          }
        }
        if (isNaN(flags.COMPOUNDMIN)) {
          flags.COMPOUNDMIN = 3;
        }
        if (!flags.KEY.length) {
          flags.KEY = defaultKeyboardLayout;
        }
        if (!flags.TRY) {
          flags.TRY = alphabet.concat();
        }
        if (!flags.KEEPCASE) {
          flags.KEEPCASE = false;
        }
        return {
          compoundRuleCodes,
          replacementTable,
          conversion,
          compoundRules,
          rules,
          flags
        };
        function pushLine(line2) {
          line2 = line2.trim();
          if (line2 && line2.charCodeAt(0) !== 35) {
            lines.push(line2);
          }
        }
      }
      function end(source) {
        return new RegExp(source + "$");
      }
      function start(source) {
        return new RegExp("^" + source);
      }
    }
  });

  // node_modules/nspell/lib/util/normalize.js
  var require_normalize = __commonJS({
    "node_modules/nspell/lib/util/normalize.js"(exports, module) {
      "use strict";
      module.exports = normalize;
      function normalize(value, patterns) {
        var index = -1;
        while (++index < patterns.length) {
          value = value.replace(patterns[index][0], patterns[index][1]);
        }
        return value;
      }
    }
  });

  // node_modules/nspell/lib/util/flag.js
  var require_flag = __commonJS({
    "node_modules/nspell/lib/util/flag.js"(exports, module) {
      "use strict";
      module.exports = flag;
      function flag(values, value, flags) {
        return flags && value in values && flags.indexOf(values[value]) > -1;
      }
    }
  });

  // node_modules/nspell/lib/util/exact.js
  var require_exact = __commonJS({
    "node_modules/nspell/lib/util/exact.js"(exports, module) {
      "use strict";
      var flag = require_flag();
      module.exports = exact;
      function exact(context, value) {
        var index = -1;
        if (context.data[value]) {
          return !flag(context.flags, "ONLYINCOMPOUND", context.data[value]);
        }
        if (value.length >= context.flags.COMPOUNDMIN) {
          while (++index < context.compoundRules.length) {
            if (context.compoundRules[index].test(value)) {
              return true;
            }
          }
        }
        return false;
      }
    }
  });

  // node_modules/nspell/lib/util/form.js
  var require_form = __commonJS({
    "node_modules/nspell/lib/util/form.js"(exports, module) {
      "use strict";
      var normalize = require_normalize();
      var exact = require_exact();
      var flag = require_flag();
      module.exports = form;
      function form(context, value, all) {
        var normal = value.trim();
        var alternative;
        if (!normal) {
          return null;
        }
        normal = normalize(normal, context.conversion.in);
        if (exact(context, normal)) {
          if (!all && flag(context.flags, "FORBIDDENWORD", context.data[normal])) {
            return null;
          }
          return normal;
        }
        if (normal.toUpperCase() === normal) {
          alternative = normal.charAt(0) + normal.slice(1).toLowerCase();
          if (ignore(context.flags, context.data[alternative], all)) {
            return null;
          }
          if (exact(context, alternative)) {
            return alternative;
          }
        }
        alternative = normal.toLowerCase();
        if (alternative !== normal) {
          if (ignore(context.flags, context.data[alternative], all)) {
            return null;
          }
          if (exact(context, alternative)) {
            return alternative;
          }
        }
        return null;
      }
      function ignore(flags, dict, all) {
        return flag(flags, "KEEPCASE", dict) || all || flag(flags, "FORBIDDENWORD", dict);
      }
    }
  });

  // node_modules/nspell/lib/correct.js
  var require_correct = __commonJS({
    "node_modules/nspell/lib/correct.js"(exports, module) {
      "use strict";
      var form = require_form();
      module.exports = correct;
      function correct(value) {
        return Boolean(form(this, value));
      }
    }
  });

  // node_modules/nspell/lib/util/casing.js
  var require_casing = __commonJS({
    "node_modules/nspell/lib/util/casing.js"(exports, module) {
      "use strict";
      module.exports = casing;
      function casing(value) {
        var head = exact(value.charAt(0));
        var rest = value.slice(1);
        if (!rest) {
          return head;
        }
        rest = exact(rest);
        if (head === rest) {
          return head;
        }
        if (head === "u" && rest === "l") {
          return "s";
        }
        return null;
      }
      function exact(value) {
        return value === value.toLowerCase() ? "l" : value === value.toUpperCase() ? "u" : null;
      }
    }
  });

  // node_modules/nspell/lib/suggest.js
  var require_suggest = __commonJS({
    "node_modules/nspell/lib/suggest.js"(exports, module) {
      "use strict";
      var casing = require_casing();
      var normalize = require_normalize();
      var flag = require_flag();
      var form = require_form();
      module.exports = suggest;
      var push = [].push;
      function suggest(value) {
        var self = this;
        var charAdded = {};
        var suggestions = [];
        var weighted = {};
        var memory;
        var replacement;
        var edits = [];
        var values;
        var index;
        var offset;
        var position;
        var count;
        var otherOffset;
        var otherCharacter;
        var character;
        var group;
        var before;
        var after;
        var upper;
        var insensitive;
        var firstLevel;
        var previous;
        var next;
        var nextCharacter;
        var max;
        var distance;
        var size;
        var normalized;
        var suggestion;
        var currentCase;
        value = normalize(value.trim(), self.conversion.in);
        if (!value || self.correct(value)) {
          return [];
        }
        currentCase = casing(value);
        index = -1;
        while (++index < self.replacementTable.length) {
          replacement = self.replacementTable[index];
          offset = value.indexOf(replacement[0]);
          while (offset > -1) {
            edits.push(value.replace(replacement[0], replacement[1]));
            offset = value.indexOf(replacement[0], offset + 1);
          }
        }
        index = -1;
        while (++index < value.length) {
          character = value.charAt(index);
          before = value.slice(0, index);
          after = value.slice(index + 1);
          insensitive = character.toLowerCase();
          upper = insensitive !== character;
          charAdded = {};
          offset = -1;
          while (++offset < self.flags.KEY.length) {
            group = self.flags.KEY[offset];
            position = group.indexOf(insensitive);
            if (position < 0) {
              continue;
            }
            otherOffset = -1;
            while (++otherOffset < group.length) {
              if (otherOffset !== position) {
                otherCharacter = group.charAt(otherOffset);
                if (charAdded[otherCharacter]) {
                  continue;
                }
                charAdded[otherCharacter] = true;
                if (upper) {
                  otherCharacter = otherCharacter.toUpperCase();
                }
                edits.push(before + otherCharacter + after);
              }
            }
          }
        }
        index = -1;
        nextCharacter = value.charAt(0);
        values = [""];
        max = 1;
        distance = 0;
        while (++index < value.length) {
          character = nextCharacter;
          nextCharacter = value.charAt(index + 1);
          before = value.slice(0, index);
          replacement = character === nextCharacter ? "" : character + character;
          offset = -1;
          count = values.length;
          while (++offset < count) {
            if (offset <= max) {
              values.push(values[offset] + replacement);
            }
            values[offset] += character;
          }
          if (++distance < 3) {
            max = values.length;
          }
        }
        push.apply(edits, values);
        values = [value];
        replacement = value.toLowerCase();
        if (value === replacement || currentCase === null) {
          values.push(value.charAt(0).toUpperCase() + replacement.slice(1));
        }
        replacement = value.toUpperCase();
        if (value !== replacement) {
          values.push(replacement);
        }
        memory = {
          state: {},
          weighted,
          suggestions
        };
        firstLevel = generate(self, memory, values, edits);
        previous = 0;
        max = Math.min(firstLevel.length, Math.pow(Math.max(15 - value.length, 3), 3));
        size = Math.max(Math.pow(10 - value.length, 3), 1);
        while (!suggestions.length && previous < max) {
          next = previous + size;
          generate(self, memory, firstLevel.slice(previous, next));
          previous = next;
        }
        suggestions.sort(sort);
        values = [];
        normalized = [];
        index = -1;
        while (++index < suggestions.length) {
          suggestion = normalize(suggestions[index], self.conversion.out);
          replacement = suggestion.toLowerCase();
          if (normalized.indexOf(replacement) < 0) {
            values.push(suggestion);
            normalized.push(replacement);
          }
        }
        return values;
        function sort(a, b) {
          return sortWeight(a, b) || sortCasing(a, b) || sortAlpha(a, b);
        }
        function sortWeight(a, b) {
          return weighted[a] === weighted[b] ? 0 : weighted[a] > weighted[b] ? -1 : 1;
        }
        function sortCasing(a, b) {
          var leftCasing = casing(a);
          var rightCasing = casing(b);
          return leftCasing === rightCasing ? 0 : leftCasing === currentCase ? -1 : rightCasing === currentCase ? 1 : void 0;
        }
        function sortAlpha(a, b) {
          return a.localeCompare(b);
        }
      }
      function generate(context, memory, words, edits) {
        var characters = context.flags.TRY;
        var data = context.data;
        var flags = context.flags;
        var result = [];
        var index = -1;
        var word;
        var before;
        var character;
        var nextCharacter;
        var nextAfter;
        var nextNextAfter;
        var nextUpper;
        var currentCase;
        var position;
        var after;
        var upper;
        var inject;
        var offset;
        if (edits) {
          while (++index < edits.length) {
            check(edits[index], true);
          }
        }
        index = -1;
        while (++index < words.length) {
          word = words[index];
          before = "";
          character = "";
          nextCharacter = word.charAt(0);
          nextAfter = word;
          nextNextAfter = word.slice(1);
          nextUpper = nextCharacter.toLowerCase() !== nextCharacter;
          currentCase = casing(word);
          position = -1;
          while (++position <= word.length) {
            before += character;
            after = nextAfter;
            nextAfter = nextNextAfter;
            nextNextAfter = nextAfter.slice(1);
            character = nextCharacter;
            nextCharacter = word.charAt(position + 1);
            upper = nextUpper;
            if (nextCharacter) {
              nextUpper = nextCharacter.toLowerCase() !== nextCharacter;
            }
            if (nextAfter && upper !== nextUpper) {
              check(before + switchCase(nextAfter));
              check(
                before + switchCase(nextCharacter) + switchCase(character) + nextNextAfter
              );
            }
            check(before + nextAfter);
            if (nextAfter) {
              check(before + nextCharacter + character + nextNextAfter);
            }
            offset = -1;
            while (++offset < characters.length) {
              inject = characters[offset];
              if (upper && inject !== inject.toUpperCase()) {
                if (currentCase !== "s") {
                  check(before + inject + after);
                  check(before + inject + nextAfter);
                }
                inject = inject.toUpperCase();
                check(before + inject + after);
                check(before + inject + nextAfter);
              } else {
                check(before + inject + after);
                check(before + inject + nextAfter);
              }
            }
          }
        }
        return result;
        function check(value, double) {
          var state = memory.state[value];
          var corrected;
          if (state !== Boolean(state)) {
            result.push(value);
            corrected = form(context, value);
            state = corrected && !flag(flags, "NOSUGGEST", data[corrected]);
            memory.state[value] = state;
            if (state) {
              memory.weighted[value] = double ? 10 : 0;
              memory.suggestions.push(value);
            }
          }
          if (state) {
            memory.weighted[value]++;
          }
        }
        function switchCase(fragment) {
          var first = fragment.charAt(0);
          return (first.toLowerCase() === first ? first.toUpperCase() : first.toLowerCase()) + fragment.slice(1);
        }
      }
    }
  });

  // node_modules/nspell/lib/spell.js
  var require_spell = __commonJS({
    "node_modules/nspell/lib/spell.js"(exports, module) {
      "use strict";
      var form = require_form();
      var flag = require_flag();
      module.exports = spell;
      function spell(word) {
        var self = this;
        var value = form(self, word, true);
        return {
          correct: self.correct(word),
          forbidden: Boolean(
            value && flag(self.flags, "FORBIDDENWORD", self.data[value])
          ),
          warn: Boolean(value && flag(self.flags, "WARN", self.data[value]))
        };
      }
    }
  });

  // node_modules/nspell/lib/util/apply.js
  var require_apply = __commonJS({
    "node_modules/nspell/lib/util/apply.js"(exports, module) {
      "use strict";
      module.exports = apply;
      function apply(value, rule, rules, words) {
        var index = -1;
        var entry;
        var next;
        var continuationRule;
        var continuation;
        var position;
        while (++index < rule.entries.length) {
          entry = rule.entries[index];
          continuation = entry.continuation;
          position = -1;
          if (!entry.match || entry.match.test(value)) {
            next = entry.remove ? value.replace(entry.remove, "") : value;
            next = rule.type === "SFX" ? next + entry.add : entry.add + next;
            words.push(next);
            if (continuation && continuation.length) {
              while (++position < continuation.length) {
                continuationRule = rules[continuation[position]];
                if (continuationRule) {
                  apply(next, continuationRule, rules, words);
                }
              }
            }
          }
        }
        return words;
      }
    }
  });

  // node_modules/nspell/lib/util/add.js
  var require_add = __commonJS({
    "node_modules/nspell/lib/util/add.js"(exports, module) {
      "use strict";
      var apply = require_apply();
      module.exports = add;
      var push = [].push;
      var NO_RULES = [];
      function addRules(dict, word, rules) {
        var curr = dict[word];
        if (word in dict) {
          if (curr === NO_RULES) {
            dict[word] = rules.concat();
          } else {
            push.apply(curr, rules);
          }
        } else {
          dict[word] = rules.concat();
        }
      }
      function add(dict, word, codes, options) {
        var position = -1;
        var rule;
        var offset;
        var subposition;
        var suboffset;
        var combined;
        var newWords;
        var otherNewWords;
        if (!("NEEDAFFIX" in options.flags) || codes.indexOf(options.flags.NEEDAFFIX) < 0) {
          addRules(dict, word, codes);
        }
        while (++position < codes.length) {
          rule = options.rules[codes[position]];
          if (codes[position] in options.compoundRuleCodes) {
            options.compoundRuleCodes[codes[position]].push(word);
          }
          if (rule) {
            newWords = apply(word, rule, options.rules, []);
            offset = -1;
            while (++offset < newWords.length) {
              if (!(newWords[offset] in dict)) {
                dict[newWords[offset]] = NO_RULES;
              }
              if (rule.combineable) {
                subposition = position;
                while (++subposition < codes.length) {
                  combined = options.rules[codes[subposition]];
                  if (combined && combined.combineable && rule.type !== combined.type) {
                    otherNewWords = apply(
                      newWords[offset],
                      combined,
                      options.rules,
                      []
                    );
                    suboffset = -1;
                    while (++suboffset < otherNewWords.length) {
                      if (!(otherNewWords[suboffset] in dict)) {
                        dict[otherNewWords[suboffset]] = NO_RULES;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  // node_modules/nspell/lib/add.js
  var require_add2 = __commonJS({
    "node_modules/nspell/lib/add.js"(exports, module) {
      "use strict";
      var push = require_add();
      module.exports = add;
      var NO_CODES = [];
      function add(value, model) {
        var self = this;
        push(self.data, value, self.data[model] || NO_CODES, self);
        return self;
      }
    }
  });

  // node_modules/nspell/lib/remove.js
  var require_remove = __commonJS({
    "node_modules/nspell/lib/remove.js"(exports, module) {
      "use strict";
      module.exports = remove;
      function remove(value) {
        var self = this;
        delete self.data[value];
        return self;
      }
    }
  });

  // node_modules/nspell/lib/word-characters.js
  var require_word_characters = __commonJS({
    "node_modules/nspell/lib/word-characters.js"(exports, module) {
      "use strict";
      module.exports = wordCharacters;
      function wordCharacters() {
        return this.flags.WORDCHARS || null;
      }
    }
  });

  // node_modules/nspell/lib/util/dictionary.js
  var require_dictionary = __commonJS({
    "node_modules/nspell/lib/util/dictionary.js"(exports, module) {
      "use strict";
      var parseCodes = require_rule_codes();
      var add = require_add();
      module.exports = parse;
      var whiteSpaceExpression = /\s/g;
      function parse(buf, options, dict) {
        var value = buf.toString("utf8");
        var last = value.indexOf("\n") + 1;
        var index = value.indexOf("\n", last);
        while (index > -1) {
          if (value.charCodeAt(last) !== 9) {
            parseLine(value.slice(last, index), options, dict);
          }
          last = index + 1;
          index = value.indexOf("\n", last);
        }
        parseLine(value.slice(last), options, dict);
      }
      function parseLine(line, options, dict) {
        var slashOffset = line.indexOf("/");
        var hashOffset = line.indexOf("#");
        var codes = "";
        var word;
        var result;
        while (slashOffset > -1 && line.charCodeAt(slashOffset - 1) === 92) {
          line = line.slice(0, slashOffset - 1) + line.slice(slashOffset);
          slashOffset = line.indexOf("/", slashOffset);
        }
        if (hashOffset > -1) {
          if (slashOffset > -1 && slashOffset < hashOffset) {
            word = line.slice(0, slashOffset);
            whiteSpaceExpression.lastIndex = slashOffset + 1;
            result = whiteSpaceExpression.exec(line);
            codes = line.slice(slashOffset + 1, result ? result.index : void 0);
          } else {
            word = line.slice(0, hashOffset);
          }
        } else if (slashOffset > -1) {
          word = line.slice(0, slashOffset);
          codes = line.slice(slashOffset + 1);
        } else {
          word = line;
        }
        word = word.trim();
        if (word) {
          add(dict, word, parseCodes(options.flags, codes.trim()), options);
        }
      }
    }
  });

  // node_modules/nspell/lib/dictionary.js
  var require_dictionary2 = __commonJS({
    "node_modules/nspell/lib/dictionary.js"(exports, module) {
      "use strict";
      var parse = require_dictionary();
      module.exports = add;
      function add(buf) {
        var self = this;
        var index = -1;
        var rule;
        var source;
        var character;
        var offset;
        parse(buf, self, self.data);
        while (++index < self.compoundRules.length) {
          rule = self.compoundRules[index];
          source = "";
          offset = -1;
          while (++offset < rule.length) {
            character = rule.charAt(offset);
            source += self.compoundRuleCodes[character].length ? "(?:" + self.compoundRuleCodes[character].join("|") + ")" : character;
          }
          self.compoundRules[index] = new RegExp(source, "i");
        }
        return self;
      }
    }
  });

  // node_modules/nspell/lib/personal.js
  var require_personal = __commonJS({
    "node_modules/nspell/lib/personal.js"(exports, module) {
      "use strict";
      module.exports = add;
      function add(buf) {
        var self = this;
        var lines = buf.toString("utf8").split("\n");
        var index = -1;
        var line;
        var forbidden;
        var word;
        var flag;
        if (self.flags.FORBIDDENWORD === void 0) self.flags.FORBIDDENWORD = false;
        flag = self.flags.FORBIDDENWORD;
        while (++index < lines.length) {
          line = lines[index].trim();
          if (!line) {
            continue;
          }
          line = line.split("/");
          word = line[0];
          forbidden = word.charAt(0) === "*";
          if (forbidden) {
            word = word.slice(1);
          }
          self.add(word, line[1]);
          if (forbidden) {
            self.data[word].push(flag);
          }
        }
        return self;
      }
    }
  });

  // node_modules/nspell/lib/index.js
  var require_lib = __commonJS({
    "node_modules/nspell/lib/index.js"(exports, module) {
      "use strict";
      var buffer = require_is_buffer();
      var affix = require_affix();
      module.exports = NSpell;
      var proto = NSpell.prototype;
      proto.correct = require_correct();
      proto.suggest = require_suggest();
      proto.spell = require_spell();
      proto.add = require_add2();
      proto.remove = require_remove();
      proto.wordCharacters = require_word_characters();
      proto.dictionary = require_dictionary2();
      proto.personal = require_personal();
      function NSpell(aff, dic) {
        var index = -1;
        var dictionaries;
        if (!(this instanceof NSpell)) {
          return new NSpell(aff, dic);
        }
        if (typeof aff === "string" || buffer(aff)) {
          if (typeof dic === "string" || buffer(dic)) {
            dictionaries = [{ dic }];
          }
        } else if (aff) {
          if ("length" in aff) {
            dictionaries = aff;
            aff = aff[0] && aff[0].aff;
          } else {
            if (aff.dic) {
              dictionaries = [aff];
            }
            aff = aff.aff;
          }
        }
        if (!aff) {
          throw new Error("Missing `aff` in dictionary");
        }
        aff = affix(aff);
        this.data = /* @__PURE__ */ Object.create(null);
        this.compoundRuleCodes = aff.compoundRuleCodes;
        this.replacementTable = aff.replacementTable;
        this.conversion = aff.conversion;
        this.compoundRules = aff.compoundRules;
        this.rules = aff.rules;
        this.flags = aff.flags;
        if (dictionaries) {
          while (++index < dictionaries.length) {
            if (dictionaries[index].dic) {
              this.dictionary(dictionaries[index].dic);
            }
          }
        }
      }
    }
  });

  // src/rules.js
  var DEFAULT_SETTINGS = {
    enabled: true,
    spellcheckEnabled: true,
    autoFixOnBlur: true,
    fixEllipsis: true,
    fixIpCommas: true,
    capitalizeSentences: true,
    capitalizeNames: true,
    namesList: [
      "\u0418\u0432\u0430\u043D",
      "\u041C\u0430\u0440\u0438\u044F",
      "\u0413\u0435\u043E\u0440\u0433\u0438",
      "\u041F\u0435\u0442\u044A\u0440",
      "\u0421\u0442\u043E\u044F\u043D",
      "\u041D\u0438\u043A\u043E\u043B\u0430",
      "\u0415\u043B\u0435\u043D\u0430",
      "\u0425\u0440\u0438\u0441\u0442\u043E",
      "\u0414\u0438\u043C\u0438\u0442\u044A\u0440",
      "\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u044A\u0440",
      "\u0421\u043E\u0444\u0438\u044F",
      "\u041F\u043B\u043E\u0432\u0434\u0438\u0432",
      "\u0412\u0430\u0440\u043D\u0430",
      "\u0411\u0443\u0440\u0433\u0430\u0441"
    ],
    customRules: []
    // [{ find: string, replace: string, isRegex: boolean, flags: string }]
  };
  var LETTER = "\\p{L}";
  var WORD_BOUNDARY_START = `(?<!${LETTER})`;
  var WORD_BOUNDARY_END = `(?!${LETTER})`;
  function fixEllipsis(text) {
    return text.replace(/(\.{2,}|\u2026+)/g, ".");
  }
  function fixIpCommas(text) {
    const ipCommaPattern = /\b(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\b/g;
    return text.replace(ipCommaPattern, (match, a, b, c, d) => {
      const octets = [a, b, c, d];
      if (octets.every((o) => Number(o) <= 255)) {
        return octets.join(".");
      }
      return match;
    });
  }
  function capitalizeSentences(text) {
    let result = text.replace(/^(\s*)(\p{L})/u, (m, sp, ch) => sp + ch.toUpperCase());
    result = result.replace(/([.!?]\s+)(\p{L})/gu, (m, sep, ch) => sep + ch.toUpperCase());
    return result;
  }
  function capitalizeNames(text, namesList) {
    if (!namesList || namesList.length === 0) return text;
    let result = text;
    for (const name of namesList) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`${WORD_BOUNDARY_START}${escaped}${WORD_BOUNDARY_END}`, "giu");
      const proper = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      result = result.replace(re, proper);
    }
    return result;
  }
  function applyCustomRules(text, customRules) {
    if (!customRules || customRules.length === 0) return text;
    let result = text;
    for (const rule of customRules) {
      if (!rule.find) continue;
      try {
        if (rule.isRegex) {
          const re = new RegExp(rule.find, rule.flags || "g");
          result = result.replace(re, rule.replace ?? "");
        } else {
          const escaped = rule.find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const re = new RegExp(escaped, "g");
          result = result.replace(re, rule.replace ?? "");
        }
      } catch (e) {
      }
    }
    return result;
  }
  function applyAutoFixes(text, settings2) {
    if (!text) return text;
    let result = text;
    if (settings2.fixEllipsis) result = fixEllipsis(result);
    if (settings2.fixIpCommas) result = fixIpCommas(result);
    if (settings2.customRules) result = applyCustomRules(result, settings2.customRules);
    if (settings2.capitalizeSentences) result = capitalizeSentences(result);
    if (settings2.capitalizeNames) result = capitalizeNames(result, settings2.namesList);
    return result;
  }

  // src/spellchecker.js
  var import_nspell = __toESM(require_lib());
  var spellerPromise = null;
  var spellerInstance = null;
  var knownWordsAdded = /* @__PURE__ */ new Set();
  function addKnownWords(speller, words) {
    for (const raw of words || []) {
      const w = (raw || "").trim();
      if (!w || knownWordsAdded.has(w)) continue;
      knownWordsAdded.add(w);
      speller.add(w);
      const lower = w.toLowerCase();
      if (lower !== w && !knownWordsAdded.has(lower)) {
        knownWordsAdded.add(lower);
        speller.add(lower);
      }
    }
  }
  function getSpeller() {
    if (!spellerPromise) {
      spellerPromise = (async () => {
        const affUrl = chrome.runtime.getURL("dict/bg.aff");
        const dicUrl = chrome.runtime.getURL("dict/bg.dic");
        const [aff, dic] = await Promise.all([
          fetch(affUrl).then((r) => r.text()),
          fetch(dicUrl).then((r) => r.text())
        ]);
        const speller = (0, import_nspell.default)(aff, dic);
        addKnownWords(speller, settings.namesList);
        spellerInstance = speller;
        return speller;
      })();
    }
    return spellerPromise;
  }
  var CYRILLIC_RE = /[\u0400-\u04FF]/;
  var WORD_TOKEN_RE = /[\p{L}\p{M}'-]+/gu;
  async function checkText(text) {
    const speller = await getSpeller();
    const results = [];
    WORD_TOKEN_RE.lastIndex = 0;
    let match;
    while ((match = WORD_TOKEN_RE.exec(text)) !== null) {
      const word = match[0];
      if (!CYRILLIC_RE.test(word) || word.length <= 1) continue;
      if (/^\d+$/.test(word)) continue;
      if (!speller.correct(word)) {
        results.push({
          word,
          index: match.index,
          length: word.length,
          suggestions: speller.suggest(word).slice(0, 5)
        });
      }
    }
    return results;
  }

  // src/overlay.js
  var MIRRORED_PROPS = [
    "boxSizing",
    "width",
    "height",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderTopStyle",
    "borderRightStyle",
    "borderBottomStyle",
    "borderLeftStyle",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "lineHeight",
    "textAlign",
    "textIndent",
    "textTransform",
    "wordSpacing",
    "tabSize"
  ];
  var SpellOverlay = class {
    constructor(field) {
      this.field = field;
      this.isTextarea = field.tagName === "TEXTAREA";
      this.mirror = document.createElement("div");
      this.mirror.className = "bg-spell-overlay";
      this.mirror.setAttribute("aria-hidden", "true");
      document.body.appendChild(this.mirror);
      this._syncBoxStyle();
      this._positionListener = () => this._syncPosition();
      window.addEventListener("scroll", this._positionListener, true);
      window.addEventListener("resize", this._positionListener);
      field.addEventListener("scroll", () => this._syncScroll());
      this._resizeObserver = new ResizeObserver(() => {
        this._syncBoxStyle();
        this._syncPosition();
      });
      this._resizeObserver.observe(field);
    }
    _syncBoxStyle() {
      const cs = getComputedStyle(this.field);
      this.mirror.style.whiteSpace = this.isTextarea ? "pre-wrap" : "pre";
      this.mirror.style.wordWrap = "break-word";
      this.mirror.style.overflow = "hidden";
      for (const prop of MIRRORED_PROPS) {
        this.mirror.style[prop] = cs[prop];
      }
      this._syncPosition();
    }
    _syncPosition() {
      const rect = this.field.getBoundingClientRect();
      Object.assign(this.mirror.style, {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        pointerEvents: "none",
        zIndex: "2147483000"
      });
    }
    _syncScroll() {
      this.mirror.scrollTop = this.field.scrollTop;
      this.mirror.scrollLeft = this.field.scrollLeft;
    }
    /** matches: array of { index, length } sorted by index */
    render(text, matches) {
      this.mirror.textContent = "";
      if (!matches || matches.length === 0) return;
      const frag = document.createDocumentFragment();
      let cursor = 0;
      for (const m of matches) {
        if (m.index > cursor) {
          frag.appendChild(document.createTextNode(text.slice(cursor, m.index)));
        }
        const word = text.slice(m.index, m.index + m.length);
        const span = document.createElement("span");
        span.className = "bg-spell-error";
        span.textContent = word;
        frag.appendChild(span);
        cursor = m.index + m.length;
      }
      if (cursor < text.length) {
        frag.appendChild(document.createTextNode(text.slice(cursor)));
      }
      frag.appendChild(document.createTextNode("\xA0"));
      this.mirror.appendChild(frag);
      this._syncScroll();
    }
    show() {
      this.mirror.style.display = "";
      this._syncPosition();
    }
    hide() {
      this.mirror.style.display = "none";
    }
    destroy() {
      window.removeEventListener("scroll", this._positionListener, true);
      window.removeEventListener("resize", this._positionListener);
      this._resizeObserver.disconnect();
      this.mirror.remove();
    }
  };

  // src/content.js
  var settings = { ...DEFAULT_SETTINGS };
  var lastFocused = null;
  var TEXTY_INPUT_TYPES = /* @__PURE__ */ new Set([
    "text",
    "search",
    "email",
    "url",
    "tel",
    null,
    ""
  ]);
  function isTextField(el) {
    if (!el) return false;
    if (el.tagName === "TEXTAREA") return true;
    if (el.tagName === "INPUT") return TEXTY_INPUT_TYPES.has(el.getAttribute("type"));
    return false;
  }
  function isContentEditable(el) {
    return !!el && el.isContentEditable === true;
  }
  var fieldState = /* @__PURE__ */ new WeakMap();
  function getState(el) {
    if (!fieldState.has(el)) {
      fieldState.set(el, { overlay: null, misspellings: [], debounceTimer: null });
    }
    return fieldState.get(el);
  }
  async function runSpellcheck(el) {
    if (!settings.enabled || !settings.spellcheckEnabled) return;
    const state = getState(el);
    const text = el.value;
    try {
      const results = await checkText(text);
      if (el.value !== text) return;
      state.misspellings = results;
      if (!state.overlay) state.overlay = new SpellOverlay(el);
      state.overlay.render(text, results);
    } catch (e) {
    }
  }
  function debouncedSpellcheck(el) {
    const state = getState(el);
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => runSpellcheck(el), 350);
  }
  function applyFixesTo(el) {
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      const start = el.selectionStart;
      const before = el.value;
      const after = applyAutoFixes(before, settings);
      if (after !== before) {
        el.value = after;
        const delta = after.length - before.length;
        const pos = Math.max(0, (start ?? after.length) + delta);
        try {
          el.setSelectionRange(pos, pos);
        } catch (e) {
        }
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } else if (isContentEditable(el)) {
      if (el.children.length === 0) {
        const before = el.textContent;
        const after = applyAutoFixes(before, settings);
        if (after !== before) {
          el.textContent = after;
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    }
  }
  var suggestionBox = null;
  function hideSuggestionBox() {
    if (suggestionBox) {
      suggestionBox.remove();
      suggestionBox = null;
    }
  }
  function showSuggestionBox(el, match, screenX, screenY) {
    hideSuggestionBox();
    const box = document.createElement("div");
    box.className = "bg-spell-suggestions";
    box.style.left = `${screenX}px`;
    box.style.top = `${screenY}px`;
    const title = document.createElement("div");
    title.className = "bg-spell-suggestions-title";
    title.textContent = `"${match.word}" - \u0432\u044A\u0437\u043C\u043E\u0436\u043D\u0438 \u043F\u043E\u043F\u0440\u0430\u0432\u043A\u0438:`;
    box.appendChild(title);
    if (match.suggestions.length === 0) {
      const none = document.createElement("div");
      none.className = "bg-spell-suggestions-empty";
      none.textContent = "\u041D\u044F\u043C\u0430 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F";
      box.appendChild(none);
    }
    for (const s of match.suggestions) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bg-spell-suggestion-item";
      btn.textContent = s;
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const val = el.value;
        const newVal = val.slice(0, match.index) + s + val.slice(match.index + match.length);
        el.value = newVal;
        el.focus();
        const pos = match.index + s.length;
        try {
          el.setSelectionRange(pos, pos);
        } catch (err) {
        }
        el.dispatchEvent(new Event("input", { bubbles: true }));
        hideSuggestionBox();
      });
      box.appendChild(btn);
    }
    document.body.appendChild(box);
    suggestionBox = box;
  }
  document.addEventListener("mousedown", (e) => {
    if (suggestionBox && !suggestionBox.contains(e.target)) hideSuggestionBox();
  });
  function handleFieldClick(el, e) {
    const state = getState(el);
    if (!state.misspellings || state.misspellings.length === 0) return;
    const idx = el.selectionStart;
    const hit = state.misspellings.find((m) => idx >= m.index && idx <= m.index + m.length);
    if (hit) {
      const rect = el.getBoundingClientRect();
      showSuggestionBox(el, hit, e.clientX, rect.bottom + 4);
    } else {
      hideSuggestionBox();
    }
  }
  var wired = /* @__PURE__ */ new WeakSet();
  function wireField(el) {
    if (wired.has(el)) return;
    wired.add(el);
    if (isTextField(el)) {
      el.setAttribute("spellcheck", "true");
      if (!el.getAttribute("lang")) el.setAttribute("lang", "bg");
      el.addEventListener("focus", () => {
        lastFocused = el;
        const state = getState(el);
        if (state.overlay) state.overlay.show();
        if (el.value) debouncedSpellcheck(el);
      });
      el.addEventListener("input", () => debouncedSpellcheck(el));
      el.addEventListener("click", (e) => handleFieldClick(el, e));
      el.addEventListener("blur", () => {
        hideSuggestionBox();
        if (settings.enabled && settings.autoFixOnBlur) applyFixesTo(el);
        const state = getState(el);
        if (state.overlay) debouncedSpellcheck(el);
      });
    } else if (isContentEditable(el)) {
      el.setAttribute("spellcheck", "true");
      if (!el.getAttribute("lang")) el.setAttribute("lang", "bg");
      el.addEventListener("focus", () => {
        lastFocused = el;
      });
      el.addEventListener("blur", () => {
        if (settings.enabled && settings.autoFixOnBlur) applyFixesTo(el);
      });
    }
  }
  function scanForFields(root = document) {
    const nodes = root.querySelectorAll('input, textarea, [contenteditable=""], [contenteditable="true"]');
    nodes.forEach(wireField);
  }
  // Pending nodes get queued here instead of being scanned synchronously
  // inside the MutationObserver callback. On pages that mutate the DOM
  // heavily during load (hydration, ads, infinite scroll), the observer
  // can otherwise fire dozens/hundreds of times per second, each doing a
  // querySelectorAll walk - that's what caused the load-time stutter.
  var pendingNodes = /* @__PURE__ */ new Set();
  var flushScheduled = false;
  function flushPendingNodes() {
    flushScheduled = false;
    const nodes = pendingNodes;
    pendingNodes = /* @__PURE__ */ new Set();
    for (const node of nodes) {
      if (!node.isConnected) continue;
      if (isTextField(node) || isContentEditable(node)) wireField(node);
      scanForFields(node);
    }
  }
  function scheduleFlush() {
    if (flushScheduled) return;
    flushScheduled = true;
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(flushPendingNodes, { timeout: 500 });
    } else {
      setTimeout(flushPendingNodes, 150);
    }
  }
  var observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        pendingNodes.add(node);
      });
    }
    if (pendingNodes.size) scheduleFlush();
  });
  function init() {
    scanForFields();
    observer.observe(document.documentElement, { childList: true, subtree: true });
    console.log("[BG Spellcheck] content script loaded on", location.href, "- fields wired:", document.querySelectorAll("input, textarea, [contenteditable]").length);
  }
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    settings = { ...DEFAULT_SETTINGS, ...stored };
    init();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const key of Object.keys(changes)) {
      settings[key] = changes[key].newValue;
    }
    if (changes.namesList && spellerInstance) {
      addKnownWords(spellerInstance, changes.namesList.newValue);
    }
  });
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "APPLY_FIX_TO_ACTIVE") {
      const el = document.activeElement && (isTextField(document.activeElement) || isContentEditable(document.activeElement)) ? document.activeElement : lastFocused;
      if (el) {
        applyFixesTo(el);
        sendResponse({ ok: true });
      } else {
        sendResponse({ ok: false, reason: "no-field" });
      }
    }
    return true;
  });
})();
/*! Bundled license information:

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
