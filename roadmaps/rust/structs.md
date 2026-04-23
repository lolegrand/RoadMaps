---
id: structs
parent: types
label: Structs
explored: true
order: 1
---

# Structs

```rust
#[derive(Debug, Clone)]
struct User {
    name:   String,
    email:  String,
    age:    u32,
    active: bool,
}

impl User {
    fn new(name: &str, email: &str) -> Self {
        Self {
            name:   name.to_string(),
            email:  email.to_string(),
            age:    0,
            active: true,
        }
    }

    fn greet(&self) {
        println!("Bonjour, {} !", self.name);
    }
}

fn main() {
    let u = User::new("Alice", "alice@example.com");
    u.greet();
    println!("{:#?}", u);
}
```

## Struct Update Syntax

```rust
let u2 = User { email: "bob@example.com".to_string(), ..u };
```
