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
        $.struct_declaration,
        $.enum_declaration,
        $.expression,
      ),

    variable_declaration: ($) =>
      prec.left(
        1,
        seq($.keyword, $.identifier, $.assignment_operator, $.expression),
      ),

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
        $.object,
        $.keyword,
        $.delimiter,
        $.bracket,
      ),

    delimiter: ($) => prec.left(0, choice(".", ",")),
    bracket: ($) => prec.left(0, choice("[", "]", "{", "}")),

    struct_declaration: ($) =>
      prec.left(1, seq($.keyword, $.identifier, $.object)),
    enum_declaration: ($) =>
      prec.left(1, seq($.keyword, $.identifier, $.variant_list)),

    function_declaration: ($) =>
      prec(
        1,
        seq(
          "(",
          optional(repeat(choice($.identifier, $.type))),
          ")",
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
    block: ($) => prec.left(1, seq("{", repeat($._statement), "}")),

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
    object: ($) =>
      prec.left(
        1,
        seq(
          "{",
          repeat(seq($.identifier, $.assignment_operator, $.expression)),
          "}",
        ),
      ),
    variant_list: ($) => prec.left(2, seq("{", repeat(seq($.identifier)), "}")),

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

    type: ($) => choice("bool", "uint", "int", "float", "str", "vec", "obj"),
    keyword: ($) => prec.left(0, choice("let", "struct", "enum", "if")),
  },
});
