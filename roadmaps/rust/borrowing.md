---
id: borrowing
parent: ownership
label: Borrowing
explored: true
order: 1
---

# Borrowing & Références

Emprunter une valeur sans en prendre l'ownership.

```rust
fn length(s: &String) -> usize {
    s.len()
} // la référence est libérée, pas la String

fn main() {
    let s = String::from("hello");
    println!("longueur : {}", length(&s));
    println!("{} est toujours valide", s); // ✅
}
```

## Règle des références

À tout moment, **soit** plusieurs `&T`, **soit** un seul `&mut T`.
Jamais les deux simultanément.

```rust
let mut s = String::from("hello");
let r1 = &s;
let r2 = &s;      // ✅ plusieurs références immuables
// let r3 = &mut s; // ❌ ne peut pas coexister avec r1/r2
println!("{} {}", r1, r2);
// r1 et r2 ne sont plus utilisées ici
let r3 = &mut s;  // ✅ maintenant c'est OK
r3.push_str(" world");
```

## Liens

- [Rust Book — References & Borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)
