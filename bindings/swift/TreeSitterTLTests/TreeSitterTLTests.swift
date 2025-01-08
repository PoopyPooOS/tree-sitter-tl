import XCTest
import SwiftTreeSitter
import TreeSitterTL

final class TreeSitterTLTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading TL grammar")
    }
}
