(comment) @comment

; Keywords
[
  (let)
  (in)
] @keyword

; Functions
(postfix_expr
  (primary (identifier) @function)
  (call))

; Identifiers
(postfix_expr
  (primary (identifier) @variable)
  !call)

(function argument: (identifier) @variable.parameter)

(binding
  name: (identifier) @function
  expr: (expr
    (postfix_expr
      (primary
        (function)))))

; Literals
(null) @constant
(boolean) @constant.builtin.boolean
(number) @constant.builtin.numeric
(string) @string
(path) @string.special.path
(escape_sequence) @constant.character.escape
(interpolation
  "${" @punctuation.special
  expr: (_) @embedded
  "}" @punctuation.special)

; Operators
(binary_operator) @operator
(unary_operator) @operator

; Symbols
[
  (dot)
  (comma)
  (equals)
  (colon)
] @punctuation.delimiter
(bracket) @punctuation.bracket
