---
id: enums
parent: types
label: Enums
explored: false
order: 2
---

# Enums & Pattern Matching

Les enums Rust peuvent **contenir des données** — bien plus puissants
que les enums classiques.

```rust
enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle { base: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r)               => std::f64::consts::PI * r * r,
            Shape::Rectangle(w, h)         => w * h,
            Shape::Triangle { base, height } => 0.5 * base * height,
        }
    }
}
```

## Option et Result

```rust
// Option : valeur présente ou absente
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

// if let pour un seul cas
if let Some(val) = divide(10.0, 3.0) {
    println!("Résultat : {:.2}", val);
}
```

## Liens

- [Rust Book — Enums](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html)
- [Rust Book — Match](https://doc.rust-lang.org/book/ch06-02-match.html)
