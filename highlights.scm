; Keywords
(let) @keyword
(if) @keyword

; Functions
(call name: (identifier) @function)

; Identifiers
(function argument: (identifier) @variable.parameter)
(self) @variable.builtin

; Literals
(comment) @comment
(boolean) @constant.builtin.boolean
(number) @constant.builtin.numeric
(string) @string
(path) @string.special
(escape_sequence) @constant.character.escape
(interpolation) @punctuation.special

; Operators
(binary_operator) @operator
(unary_operator) @operator
(assignment_operator) @operator

; Symbols
(delimiter) @punctuation.delimiter
(bracket) @punctuation.bracket

