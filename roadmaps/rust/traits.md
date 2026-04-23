---
id: traits
parent: root
label: Traits
explored: false
order: 3
---

# Traits

Les traits définissent des **comportements partagés** (proches des interfaces).

```rust
trait Summary {
    fn summarize(&self) -> String;

    // Implémentation par défaut
    fn preview(&self) -> String {
        format!("{}...", &self.summarize()[..50.min(self.summarize().len())])
    }
}

struct Article {
    title:   String,
    content: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} — {}", self.title, self.content)
    }
}
```

## Trait Bounds

```rust
// Sucre syntaxique avec impl Trait
fn print_summary(item: &impl Summary) {
    println!("{}", item.summarize());
}

// Forme générique équivalente
fn print_summary<T: Summary>(item: &T) {
    println!("{}", item.summarize());
}

// Plusieurs traits requis
fn process<T: Summary + std::fmt::Debug>(item: &T) { ... }
```

## Liens

- [Rust Book — Traits](https://doc.rust-lang.org/book/ch10-02-traits.html)
