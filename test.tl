// A comment

1
1.2
"hello"
true
false
./hi.txt
../hi.txt
/hi.txt

[ 1 2 3 ]
{ foo = bar bar = foo }

let x = 42

let name = "John Doe"
let age = 42
let full_info = "My name is ${name} and I am ${age} year${if(age == 1 "" "s")} old."
let greet = (name) {
    "Hello, my name is ${name}!"
}

greet("John Doe") // "Hello, my name is John Doe!"

let num = 10

if(
    // Condition
    num > 5
    // Then
    "Number is bigger than 5"
    // Else branch, another if statement (else if)
    if(
        num == 5
        "Number is exactly 5"
        "Number is less than 5"
    )
)

// math.tl
{
    add = (a b) {
        a + b
    }

    sub = (a b) {
        a - b
    }
}

// main.tl
let math = import(./math.tl)

println(math.add(3 5)) // 8
println(math.sub(5 3)) // 2

