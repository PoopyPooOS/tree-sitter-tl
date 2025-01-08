// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterTL",
    products: [
        .library(name: "TreeSitterTL", targets: ["TreeSitterTL"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterTL",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterTLTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterTL",
            ],
            path: "bindings/swift/TreeSitterTLTests"
        )
    ],
    cLanguageStandard: .c11
)
