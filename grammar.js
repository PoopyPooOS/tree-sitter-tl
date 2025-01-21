/**
 * @file A nix-inspired language
 * @author Whoman
 * @license GPLv3
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "tl",

  extras: ($) => [/\s/, $.comment], // Handle whitespace and comments

  rules: {
    source_file: ($) => repeat($._statement), // Root rule

    comment: ($) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),

    // Statements
    _statement: ($) =>
      choice(
        $.variable_declaration,
        $.expression,
      ),

    variable_declaration: ($) =>
      prec.left(
        1,
        seq($.keyword, field("name", $.identifier), $.assignment_operator, field("expr", $.expression)),
      ),

    // Expressions
    expression: ($) =>
      choice(
        $.function_declaration,
        $.function_call,
        $.binary_expression,
        $.unary_expression,
        $.identifier,
        $.integer,
        $.float,
        $.string,
        $.boolean,
        $.object,
        $.array,
        $.keyword,
        $.delimiter,
        $.parenthesis,
        $.bracket,
        $.brace,
      ),

    delimiter: ($) => prec.left(0, choice(".", ",")),
    parenthesis: ($) => prec.left(0, choice("(", ")")),
    bracket: ($) => prec.left(0, choice("[", "]")),
    brace: ($) => prec.left(0, choice("{", "}")),

    function_declaration: ($) =>
      prec(
        2,
        seq(
          // Arguments
          $.parenthesis,
          optional(repeat(field("argument", $.identifier))),
          $.parenthesis,
          // Return type
          $.identifier,
          // Body
          $.block,
        ),
      ),
    block: ($) => prec.left(1, seq($.brace, repeat($._statement), $.brace)),

    function_call: ($) =>
      prec(
        3,
        seq(
          field("name", choice($.identifier, $.keyword)),
          $.parenthesis,
          optional(field("argument", repeat($.expression))),
          $.parenthesis,
        ),
      ),

    // Identifiers
    identifier: ($) => choice($.self, /[a-zA-Z_][a-zA-Z0-9_]*/),
    self: ($) => "self",

    // Literals
    integer: ($) => /\d+/,
    float: ($) => /\d+.\d+/,
    string: ($) =>
      seq(
        '"',
        optional(repeat(choice(/./, $.interpolation, $.escape_sequence))),
        '"',
      ),
    escape_sequence: ($) =>
      seq(
        "\\",
        choice(
          '"',
          "\\",
          "n", // newline escape
          "t", // tab escape
        ),
      ),
    interpolation: ($) => seq("${", $.expression, "}"),
    boolean: ($) => choice("true", "false"),
    array: ($) => prec.left(1, seq($.bracket, repeat($.expression), $.bracket)),
    object: ($) =>
      prec.left(
        1,
        seq(
          $.brace,
          repeat(seq($.identifier, $.assignment_operator, $.expression)),
          $.brace,
        ),
      ),

    binary_expression: ($) =>
      prec.left(
        1,
        seq(
          $.expression,
          choice($.binary_operator, $.comparison_operator, $.logical_operator),
          $.expression,
        ),
      ),
    unary_expression: ($) => prec.right(2, seq($.unary_operator, $.expression)),

    assignment_operator: ($) => "=",
    comparison_operator: ($) => choice("==", "!=", ">", ">=", "<", "<="),
    binary_operator: ($) => choice("-", "+", "/", "*", "%"),
    logical_operator: ($) => choice("&&", "||"),
    unary_operator: ($) => "!",

    keyword: ($) => prec.left(0, choice("let", "if")),
  },
});
