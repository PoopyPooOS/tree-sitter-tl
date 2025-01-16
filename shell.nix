{
  pkgs ? import <nixpkgs> { },
}:

with pkgs;
mkShell {
  buildInputs = [
    tree-sitter
    nodejs
    gcc
  ];
}
