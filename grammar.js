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
      choice($.variable_declaration, $.struct_declaration, $.expression),

    variable_declaration: ($) => seq("let", $.identifier, "=", $.expression),

    if_statement: ($) => seq("if", $.expression, $.block),

    // Expressions
    expression: ($) =>
      choice(
        $.function_declaration,
        $.function_call,
        $.binary_expression,
        $.unary_expression,
        $.identifier,
        $.number,
        $.string,
        $.boolean,
        $.if_statement,
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

    struct_declaration: ($) =>
      seq(
        "struct",
        $.identifier,
        "{",
        repeat(seq($.identifier, "=", $.expression, "\n")),
        "}",
      ),

    function_declaration: ($) =>
      prec(
        0,
        seq(
          "(",
          optional(repeat(seq($.identifier, choice($.identifier, $.type)))),
          ") ",
          choice($.identifier, $.type),
          $.block,
        ),
      ),

    function_call: ($) =>
      prec(
        1,
        seq(choice($.identifier, "if"), "(", optional($.call_arguments), ")"),
      ),

    call_arguments: ($) => seq($.expression, repeat(seq(",", $.expression))),

    block: ($) => seq("{", repeat($._statement), "}"),

    // Tokens
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: ($) => choice(/\d+/, /\d+.\d+/),
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

    comparison_operator: ($) => choice("==", "!=", ">", ">=", "<", "<="),
    binary_operator: ($) => choice("-", "+", "/", "*", "%"),
    logical_operator: ($) => choice("&&", "||"),
    unary_operator: ($) => "!",

    type: ($) => choice("bool", "uint", "int", "float", "str", "vec", "obj"),

    keyword: ($) => choice("let", "struct", "enum", "if"),
  },
});
