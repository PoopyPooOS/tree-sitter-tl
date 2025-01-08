package tree_sitter_tl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tl "github.com/poopypooos/tree-sitter-tl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tl.Language())
	if language == nil {
		t.Errorf("Error loading TL grammar")
	}
}
