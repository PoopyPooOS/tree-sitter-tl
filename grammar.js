/**
 * @file A nix-inspired language
 * @author Whoman
 * @license GPLv3
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "tl",

  extras: ($) => [/\s/],

  rules: {
    source_file: ($) => repeat($._statement),

    comment: (_) => token(seq("//", /.*/)),

    _statement: ($) => choice($.variable_declaration, $._expr),

    variable_declaration: ($) =>
      seq(
        $.let,
        field("name", $.identifier),
        alias("=", $.assignment_operator),
        field("value", $._expr),
      ),

    _expr: ($) =>
      choice(
        $.literal,
        $.function,
        $.call,
        $.identifier,
        $.binary_expr,
        $.unary_expr,
        $.field_access,

        $.comment,
      ),

    binary_expr: ($) => prec.left(2, seq($._expr, $.binary_operator, $._expr)),
    binary_operator: ($) =>
      token(
        choice(
          "+",
          "-",
          "*",
          "/",
          "%",
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "&&",
          "||",
        ),
      ),
    unary_expr: ($) => prec.left(1, seq($.unary_operator, $._expr)),
    unary_operator: ($) => token(choice("!", "+", "-")),

    field_access: ($) =>
      prec.left(
        1,
        seq(
          $._expr,
          alias(".", $.delimiter),
          choice(prec(1, $.call), prec(0, $.identifier)),
        ),
      ),

    literal: ($) =>
      choice($.number, $.string, $.boolean, $.path, $.array, $.object),

    number: (_) => token(/\d+(\.\d+)?/),
    boolean: (_) => token(choice("true", "false")),

    string: ($) =>
      seq('"', repeat(choice(/./, $.interpolation, $.escape_sequence)), '"'),

    escape_sequence: ($) => seq("\\", choice('"', "\\", "n", "t")),

    interpolation: ($) => seq(token("${"), $._expr, token("}")),

    path: ($) =>
      prec(
        2,
        seq(
          token(choice("./", "../", "/")),
          repeat1(
            seq(
              choice($.interpolation, token.immediate(/[a-zA-Z0-9_.-]+/)),
              optional(token.immediate("/")),
            ),
          ),
        ),
      ),

    array: ($) =>
      seq(alias("[", $.bracket), repeat($._expr), alias("]", $.bracket)),

    object: ($) =>
      seq(
        alias("{", $.bracket),
        repeat(
          seq(
            field("key", $.identifier),
            alias("=", $.assignment_operator),
            field("value", $._expr),
          ),
        ),
        alias("}", $.bracket),
      ),

    function: ($) =>
      seq(
        alias("(", $.bracket),
        repeat(field("argument", $.identifier)),
        alias(")", $.bracket),
        field("body", $.block),
      ),

    block: ($) =>
      seq(alias("{", $.bracket), repeat($._statement), alias("}", $.bracket)),

    call: ($) =>
      prec(
        1,
        seq(
          field("name", choice($.identifier, $.if)),
          alias("(", $.bracket),
          repeat($._expr),
          alias(")", $.bracket),
        ),
      ),

    identifier: (_) => token(/[a-zA-Z_]\w*/),
    self: (_) => token("self"),

    // Keywords
    let: (_) => token("let"),
    if: (_) => token("if"),
  },
});
