---
id: ownership
parent: root
label: Ownership
explored: true
order: 1
---

# Ownership

Le mécanisme central de Rust pour gérer la mémoire sans GC.

## Les 3 règles

1. Chaque valeur a exactement **un owner**
2. Il ne peut y avoir qu'un seul owner à la fois
3. Quand l'owner sort du scope, la valeur est libérée (`drop`)

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // move : s1 n'est plus valide

    // println!("{}", s1); // ❌ erreur de compilation
    println!("{}", s2);   // ✅
}
```

## Copy vs Move

Les scalaires (`i32`, `bool`, `f64`...) implémentent `Copy` — ils sont
copiés automatiquement, pas déplacés.

```rust
let x = 5;
let y = x;               // copie
println!("{} {}", x, y); // ✅ les deux sont valides
```

## Liens

- [Rust Book — Ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)
