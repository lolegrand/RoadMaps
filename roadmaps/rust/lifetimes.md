---
id: lifetimes
parent: ownership
label: Lifetimes
explored: false
order: 2
---

# Lifetimes

Les lifetimes indiquent au compilateur combien de temps une
référence doit rester valide.

## Annotation explicite

Nécessaire quand le compilateur ne peut pas déduire seul.

```rust
// 'a : la valeur retournée vit au moins aussi longtemps
//       que les deux paramètres
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

## Dans les structs

```rust
struct Excerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Il était une fois...");
    let first = novel.split('.').next().unwrap();
    let exc = Excerpt { part: first };
    println!("{}", exc.part);
}
```

## Liens

- [Rust Book — Lifetimes](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html)
